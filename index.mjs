import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocument.from(new DynamoDB());


export const handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body = await dynamo.scan({ TableName: 'users' });
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    body = JSON.stringify(body);
    return {
        statusCode,
        body,
        headers,
    };
};

export const createUser = async (event) => {
  const userData = JSON.parse(event.body);

  const params = {
      TableName: 'users',
      Item: {
          id: userData.userId, 
          name: userData.name,
          lastName: userData.lastName,
          
      }
  };

  try {
      await dynamo.put(params);
      return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'User created successfully' }),
      };
  } catch (error) {
      console.error(error);
      return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Error creating user' }),
      };
  }
};