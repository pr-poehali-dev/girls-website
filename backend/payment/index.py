import json
import os
import uuid
import base64
from typing import Dict, Any
from http.client import HTTPSConnection

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create payment link via YooKassa API
    Args: event with httpMethod, body (amount, description, orderId)
          context with request_id
    Returns: HTTP response with payment URL or error
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        amount = body_data.get('amount')
        description = body_data.get('description', 'Оплата услуг')
        order_id = body_data.get('orderId', str(uuid.uuid4()))
        
        if not amount:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Amount is required'}),
                'isBase64Encoded': False
            }
        
        shop_id = os.environ.get('YOOKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Payment credentials not configured'}),
                'isBase64Encoded': False
            }
        
        idempotence_key = str(uuid.uuid4())
        
        payment_payload = {
            'amount': {
                'value': str(amount),
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': 'https://your-site.com/success'
            },
            'capture': True,
            'description': description,
            'metadata': {
                'order_id': order_id
            }
        }
        
        credentials = base64.b64encode(f'{shop_id}:{secret_key}'.encode()).decode()
        
        conn = HTTPSConnection('api.yookassa.ru')
        headers = {
            'Content-Type': 'application/json',
            'Idempotence-Key': idempotence_key,
            'Authorization': f'Basic {credentials}'
        }
        
        conn.request('POST', '/v3/payments', json.dumps(payment_payload), headers)
        response = conn.getresponse()
        response_data = json.loads(response.read().decode())
        conn.close()
        
        if response.status == 200:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'paymentId': response_data.get('id'),
                    'paymentUrl': response_data.get('confirmation', {}).get('confirmation_url'),
                    'status': response_data.get('status')
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Payment creation failed', 'details': response_data}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }