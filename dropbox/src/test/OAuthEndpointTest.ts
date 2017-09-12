import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { OAuthProcessor } from "../main/services/ServiceApi";
import { OAuthEndpoint } from "../main/endpoints/OAuthEndpoint";

class TestProcessor implements OAuthProcessor {
  public receivedCode: string;
  public receivedRedirectUri: string;

  getOAuthUri(event) {
    return "http://oauth-uri";
  }

  async processCode(code: string, redirectUri: string): Promise<void> {
    this.receivedCode = code;
    this.receivedRedirectUri = redirectUri;
  }
}

const processor = new TestProcessor();
const endpoint = new OAuthEndpoint(processor);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the Dropbox API", async () => {
      const result = await toPromise(_initiate, {});

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

  it("should forward a received code to the OAuthProcessor for processing", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "http://aws-api"
      },
      queryStringParameters: {
        code: "the code"
      }
    });

    expect(processor.receivedCode).to.equal("the code");
    expect(result.body).to.equal("The application is now authorised");
    expect(result.statusCode).to.equal(200);

  });
});
