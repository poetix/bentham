const AWS = require('aws-sdk');

export class DynamoWritePager {
  constructor(readonly client: DynamoClient) {}

  async putAll(tableName: string, items: Array<any>): Promise<any[]> {
    const results: any[] = [];
    for (let i = 0; i < items.length; i += 25) {
      const result = await this.client.putAll(tableName, items.slice(i, Math.min(items.length, i + 25)));
      results.push(result);
    }
    return results;
  }
}

export class DynamoClient {

  static dynamo = new AWS.DynamoDB.DocumentClient();

  put(tableName: string, item: any): Promise<any> {
    return this.doOp({
      TableName: tableName,
      Item: item
    }, (p, cb) => DynamoClient.dynamo.put(p, cb));
  }

  get(tableName: string, key: any): Promise<any> {
    return this.doOp({
      TableName: tableName,
      Key: key
    }, (p, cb) => DynamoClient.dynamo.get(p, cb))
      .then(result => result && result.Item || undefined);
  }

  putAll(tableName: string, items: Array<any>): Promise<any> {
    const params = {
      RequestItems: {}
    };

    params.RequestItems[tableName] = items.map(item => ({
      PutRequest: {
        Item: item
      }
    }));

    return this.doOp(params, (p, cb) => DynamoClient.dynamo.batchWrite(p, cb));
  }

  query(params: any): Promise<any[]> {
    return this.doOp(params, (p, cb) => DynamoClient.dynamo.query(p, cb))
      .then(data => data.Items);
  }

  doOp(params: any, op: (params: any, cb: (err: any, res: any) => void) => void): Promise<any> {
    return new Promise<any>((respond, reject) => {
      op(params, (err, res) => {
        if (err) {
          reject(err);
        } else {
          respond(res);
        }
      });
    });
  }
}
