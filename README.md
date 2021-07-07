# Setup Nodes (config folder)

Make SSL Cert:

`openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365`

Make config.json

```
{
    "port": <something>,
    "secret": <some string>,
    "twitch": {
        "clientID": <twitch app client id>,
        "clientSecret": <twitch app client secret>
    },
    "sslCertPassPhrase": <the password from when you generated the ssl cert>
}
```