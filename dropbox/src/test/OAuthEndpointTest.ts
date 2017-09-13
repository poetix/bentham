import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { OAuthProcessor } from "../main/services/ServiceApi";
import { OAuthEndpoint } from "../main/endpoints/OAuthEndpoint";

class TestProcessor implements OAuthProcessor {
  public receivedHost: string;
  public receivedCode: string;
  public receivedRedirectUri: string;

  getOAuthUri(host: string) {
    this.receivedHost = host;
    return "http://oauth-uri";
  }

  async processCode(code: string, redirectUri: string): Promise<string> {
    this.receivedCode = code;
    this.receivedRedirectUri = redirectUri;
    return "the-account-id";
  }
}

const processor = new TestProcessor();
const endpoint = new OAuthEndpoint(processor);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the Dropbox API", async () => {
      const result = await toPromise(_initiate, {
        headers: {
          Host: "aws-api"
        }
      });
      expect(processor.receivedHost).to.equal("aws-api");

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

  it("should redirect to the user's report on completion", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      queryStringParameters: {
        code: "the code"
      }
    });

    expect(processor.receivedCode).to.equal("the code");
    
    expect(result.statusCode).to.equal(302);
    expect(result.headers.Location).to.equal("https://aws-api/dev/dropbox-user-report?account_id=the-account-id");
  });
});
