# Content Security Policy for applications using the Amazon Chime SDK

Modern web applications use [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to protect users from certain classes of attacks. You can add a security policy by configuring your web server to return the Content-Security-Policy HTTP header or using <meta> element to configure a policy. A guide to use a Lambda@Edge function to inject security headers through CloudFront, see [Adding HTTP Security Headers Using Lambda@Edge and Amazon CloudFront](https://aws.amazon.com/blogs/networking-and-content-delivery/adding-http-security-headers-using-lambdaedge-and-amazon-cloudfront/).

## Meetings connectivity

All applications that use voice and video connectivity — _e.g._, `AudioVideoFacade` classes — will need:

* `connect-src`: `*.chime.aws` to reach signaling servers.

To enable CSP, you need to configure your web server to return the Content-Security-Policy HTTP header， like this:
```
Content-Security-Policy: connect-src '*.chime.aws'
```

Given the above CSP header, other connections that are not with `*.chime.aws` suffix will be blocked and won't load.

## Messaging

* Cognito: 

You can use Amazon Cognito for user authentication when using the Amazon Chime SDK messaging feature. For an example of how to use Amazon Cognito with the Amazon Chime SDK messaging features, see [Build chat features into your application with Amazon Chime SDK messaging](https://aws.amazon.com/blogs/business-productivity/build-chat-features-into-your-application-with-amazon-chime-sdk-messaging/). 

To improve security by enabling security specific headers, you can add the amazon aws endpoint to the connect-src directive.

```
Content-Security-Policy: connect-src 'self' '*.amazonaws.com';
```

* websocket

Chime JS SDK manages websocket connections for clients to receive real time updates on messages and events. For more information about permission setup and establishing a websocket connection, see [Using websockets to receive messages](https://docs.aws.amazon.com/chime/latest/dg/websockets.html).

To add web sockets to the security policy for security contraints, you can add the web socket protocol (ws:) to the connect-src directive.

```
Content-Security-Policy: connect-src '*.chime.aws';
```

## Logging

The JS SDK listen to securitypolicyviolation events and log blocked URI during signaling connection for join meetings. An error code starting with "Security Policy Violation" if there is securitypolicyviolation event happens.


## Amazon Voice Focus

As discussed in the [Amazon Voice Focus guide](amazonvoice_focus.html), you will need to include the following in your policy to allow the Amazon Chime SDK access to resources it needs at runtime to activate Amazon Voice Focus:

* `script-src` and `script-src-elem`: `https://*.sdkassets.chime.aws` to load audio processing code to run in the browser’s audio renderer thread.
* `connect-src`: `https://*.sdkassets.chime.aws` to load model files via `fetch`.
* `worker-src`: `blob:` to load worker JavaScript across origins.
* `child-src`: `blob:` to load worker JavaScript across origins (only in Safari).

If you need guidance with correct CSP configuration to use Amazon Voice Focus, contact AWS Support.
