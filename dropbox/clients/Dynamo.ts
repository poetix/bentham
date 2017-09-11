const AWS = require('aws-sdk');
import { DynamoClient } from "./ClientApi"

export class AWSDynamoClient implements DynamoClient {

  static dynamo = new AWS.DynamoDB.DocumentClient();

  put(tableName: string, item: any): Promise<any> {
    return this.doOp({
      TableName: tableName,
      Item: item
    }, (p, cb) => AWSDynamoClient.dynamo.put(p, cb));
  }

  get(tableName: string, key: any): Promise<any> {
    return this.doOp({
      TableName: tableName,
      Key: key
    }, (p, cb) => AWSDynamoClient.dynamo.get(p, cb));
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

    return this.doOp(params, (p, cb) => AWSDynamoClient.dynamo.writeBatch(p, cb));
  }

  doOp(params: any, op: (params: any, cb: (err: any, res: any) => void) => void): Promise<any> {
    return new Promise<any>((respond, reject) => {
      op(params, (err, res) => {
        if (err != null) {
          reject(err);
        } else {
          respond(res);
        }
      });
    });
  }
}
