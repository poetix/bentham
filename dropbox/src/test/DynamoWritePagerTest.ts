import { expect } from 'chai';
import 'mocha';
import { DynamoClient, DynamoWritePager } from "../main/clients/ClientApi";

class TestDynamoClient implements DynamoClient {

  put(tableName: string, item: any): Promise<any> {
      throw new Error("Method not implemented.");
  }

  get(tableName: string, key: any): Promise<any> {
      throw new Error("Method not implemented.");
  }

  async putAll(tableName: string, items: any[]): Promise<any> {
      return items;
  }

}

const dynamo = new TestDynamoClient();
const pager = new DynamoWritePager(dynamo);

describe("Dynamo Write Pager", () => {
  it("should break up writes into groups of 25", async () => {
    const items = Array.from({length: 60}, (value, key) => key);
    const result = await pager.putAll("table_name", items);
    
    expect(result.map(subset => subset[0])).to.deep.equal([0, 25, 50]);
    expect(result.map(subset => subset.length)).to.deep.equal([25, 25, 10]);
  });
});
