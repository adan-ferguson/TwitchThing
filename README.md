# Setup Nodes

Make config.json

```
{
    "port": <something>,
    "secret": <some string>,
    "twitch": {
        "clientID": <twitch app client id>,
        "clientSecret": <twitch app client secret>
    }
}
```

```
npm install
npm run gulp
npm rum build
npm run startdb
npm run startserver
```