# Custom DNS domain

Icarus uses [Serverless Domain Manager plugin](https://github.com/amplify-education/serverless-domain-manager)
(Also see https://serverless.com/blog/serverless-api-gateway-domain/)

To use it, you need to set up a custom public domain (or subdomain) on Route53 and add a valid cerrificarte to ACM (lambdas uses HTTPS).

The domain to use is defined in `./serverless.yml`. Change it to use a different domain

All stages are deployed to the same domain, using different basepaths.

The domain name is specified by the environment variable `ICARUS_DOMAIN`.
This domain must match with the certificate added to ACM (see below.)

## SSL Certificartes

We need a valid, signed SSL certifcate for all our subdomains.

Unless you have a paid certificate, see [here](./free_ssl_certificates.md) to generate one for free and load it into ACM.

### Create the lambdas custom domain

Once the cerfificate is loaded in ACM, you may use it for Lamda API Gateway endpoints.

API domain is handled by Serverless Domain Manager plugin:

```
sls create_domain
```

This creates the record in Route53 and the API Gateway Custom Domain Name.

The certificate, uploaded in ACM, is automatically matched by DNS domain name.

API Gateway Custom Domain uses a CloudFormation distribution under the hood. 
This distribution is not directly visible from CloudFormation interface.

The distribution may take up to 40 mins to come up and the same time to be deleted.

To monitor the deployment status of the Custom domain: *AWS Console: Amazon API Gateway > Custom Domain Names*.
The ACM Certificate status takes a while "Initialising...".
I can't find any AWS CLI equivalent for retrieving that information.

### Certificate renewal

**TBD**
