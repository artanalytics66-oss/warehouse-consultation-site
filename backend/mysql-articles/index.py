'''
Business: API для управления статьями в MySQL (CRUD операции)
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными статей
'''

import json
import os
from typing import Dict, Any
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    '''Создает подключение к MySQL'''
    connection_string = os.environ.get('MYSQL_CONNECTION', '')
    # Парсим строку mysql://user:pass@host:port/db
    parts = connection_string.replace('mysql://', '').split('@')
    user_pass = parts[0].split(':')
    host_port_db = parts[1].split('/')
    host_port = host_port_db[0].split(':')
    
    return mysql.connector.connect(
        host=host_port[0],
        port=int(host_port[1]),
        user=user_pass[0],
        password=user_pass[1],
        database=host_port_db[1]
    )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers_dict = event.get('headers', {})
    admin_auth = headers_dict.get('x-admin-auth', headers_dict.get('X-Admin-Auth', ''))
    
    # Проверка авторизации для POST/PUT/DELETE
    if method in ['POST', 'PUT', 'DELETE']:
        if admin_auth != 'admin66L:123QWE!asd':
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if method == 'GET':
            # Получить все статьи
            cursor.execute('SELECT * FROM blog_articles ORDER BY created_at DESC')
            articles = cursor.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(articles, default=str, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            # Создать статью
            body = json.loads(event.get('body', '{}'))
            cursor.execute(
                'INSERT INTO blog_articles (title, category, short_description, full_content, image_url) VALUES (%s, %s, %s, %s, %s)',
                (body['title'], body['category'], body['short_description'], body['full_content'], body.get('image_url', ''))
            )
            conn.commit()
            article_id = cursor.lastrowid
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': article_id, 'message': 'Article created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            # Обновить статью
            body = json.loads(event.get('body', '{}'))
            article_id = body.get('id')
            cursor.execute(
                'UPDATE blog_articles SET title=%s, category=%s, short_description=%s, full_content=%s, image_url=%s WHERE id=%s',
                (body['title'], body['category'], body['short_description'], body['full_content'], body.get('image_url', ''), article_id)
            )
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Article updated'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            # Удалить статью
            params = event.get('queryStringParameters', {})
            article_id = params.get('id')
            cursor.execute('DELETE FROM blog_articles WHERE id=%s', (article_id,))
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Article deleted'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
    except Error as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }