// DynampDB client for a specific table
'use strict';

class DynamoDbClient {
  constructor(dynamoDocClient, tableName) {
    this.db = dynamoDocClient;
    this.table = tableName;
  }

  // Put an item in a table
  // Returns a Promise with the inserted item
  put(item) {
    const dbItem = {
      TableName: this.table,
      Item: item,
    };

    return this.db.put(dbItem).promise()
      .then( () => item );
  }

  // TODO Add other methods, as required
}


module.exports = DynamoDbClient;
