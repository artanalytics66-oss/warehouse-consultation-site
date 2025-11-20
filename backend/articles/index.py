import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления статьями (CRUD операции)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            article_id = event.get('queryStringParameters', {}).get('id')
            
            if article_id:
                article_id_safe = str(article_id).replace("'", "''")
                cur.execute(
                    f"SELECT * FROM articles WHERE id = '{article_id_safe}'"
                )
                article = cur.fetchone()
                if not article:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Article not found'})
                    }
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(dict(article))
                }
            else:
                cur.execute(
                    "SELECT * FROM articles WHERE is_published = true ORDER BY display_order, created_at DESC"
                )
                articles = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(row) for row in articles], default=str)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            title = str(body.get('title', '')).replace("'", "''")
            short_desc = str(body.get('short_description', '')).replace("'", "''")
            full_content = str(body.get('full_content', '')).replace("'", "''")
            icon = str(body.get('icon', 'FileText')).replace("'", "''")
            display_order = int(body.get('display_order', 0))
            is_published = bool(body.get('is_published', True))
            
            cur.execute(
                f"""
                INSERT INTO articles (title, short_description, full_content, icon, display_order, is_published)
                VALUES ('{title}', '{short_desc}', '{full_content}', '{icon}', {display_order}, {is_published})
                RETURNING id, title, short_description, full_content, icon, created_at, display_order, is_published
                """
            )
            article = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(article), default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            article_id = body.get('id')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Article ID required'})
                }
            
            title = str(body.get('title', '')).replace("'", "''")
            short_desc = str(body.get('short_description', '')).replace("'", "''")
            full_content = str(body.get('full_content', '')).replace("'", "''")
            icon = str(body.get('icon', 'FileText')).replace("'", "''")
            display_order = int(body.get('display_order', 0))
            is_published = bool(body.get('is_published', True))
            article_id_safe = str(article_id).replace("'", "''")
            
            cur.execute(
                f"""
                UPDATE articles 
                SET title = '{title}', short_description = '{short_desc}', full_content = '{full_content}', 
                    icon = '{icon}', display_order = {display_order}, is_published = {is_published}, updated_at = CURRENT_TIMESTAMP
                WHERE id = '{article_id_safe}'
                RETURNING id, title, short_description, full_content, icon, updated_at, display_order, is_published
                """
            )
            article = cur.fetchone()
            conn.commit()
            
            if not article:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Article not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(article), default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            article_id = params.get('id')
            
            if not article_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Article ID required'})
                }
            
            article_id_safe = str(article_id).replace("'", "''")
            cur.execute(f"DELETE FROM articles WHERE id = '{article_id_safe}' RETURNING id")
            deleted = cur.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Article not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'id': article_id})
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()