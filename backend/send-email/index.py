import json
import smtplib
import os
import urllib.request
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send contact form submissions to email
    Args: event with httpMethod, body (name, email, message)
          context with request_id
    Returns: HTTP response with status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name', '')
    email = body_data.get('email', '')
    message = body_data.get('message', '')
    
    if not name or not email or not message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'All fields are required'})
        }
    
    smtp_password = os.environ.get('SMTP_PASSWORD')
    if not smtp_password:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'SMTP password not configured'})
        }
    
    sender_email = 'artanalytics66@gmail.com'
    receiver_email = 'artanalytics66@gmail.com'
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта от {name}'
    msg['From'] = sender_email
    msg['To'] = receiver_email
    
    message_html = message.replace('\n', '<br>')
    
    html_content = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Новая заявка с сайта</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Имя:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Сообщение:</strong></p>
          <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            {message_html}
          </p>
        </div>
      </body>
    </html>
    '''
    
    part = MIMEText(html_content, 'html')
    msg.attach(part)
    
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, smtp_password)
            server.send_message(msg)
        
        send_client_confirmation(email, name, sender_email, smtp_password)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to send email: {str(e)}'})
        }

def send_client_confirmation(client_email: str, client_name: str, sender_email: str, smtp_password: str):
    '''Send confirmation email to client'''
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Спасибо за заявку! Мы скоро свяжемся с вами'
    msg['From'] = sender_email
    msg['To'] = client_email
    
    html_body = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Здравствуйте, {client_name}!</h2>
        <p>Благодарим вас за обращение!</p>
        <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время для обсуждения вашего запроса.</p>
        <p style="margin-top: 30px;">Если у вас срочный вопрос, вы можете связаться с нами:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;">📞 Телефон: <a href="tel:+79126734195" style="color: #2563eb;">+7 (912) 673-41-95</a></li>
          <li style="margin: 10px 0;">✉️ Email: <a href="mailto:artanalytics66@gmail.com" style="color: #2563eb;">artanalytics66@gmail.com</a></li>
          <li style="margin: 10px 0;">💬 Telegram: <a href="https://t.me/LMikhail67" style="color: #2563eb;">@LMikhail67</a></li>
        </ul>
        <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          С уважением,<br>
          Консультант по складской логистике
        </p>
      </body>
    </html>
    '''
    
    part_html = MIMEText(html_body, 'html')
    msg.attach(part_html)
    
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, smtp_password)
        server.send_message(msg)