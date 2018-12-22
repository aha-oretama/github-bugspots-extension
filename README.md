# github-bugspots-extension

Display bugspots in GitHub.  
Bugspots is an implementation of the simple bug prediction heuristic outlined by the Google Engineering team (http://google-engtools.blogspot.jp/2011/12/bug-prediction-at-google.html).

## For developer

### Build 
If you build by using the following command, the raw(non-zipped) chrome extension files are created under `dist`, and the zipped chrome extension is created under `output`. 
```bash
$ npm run build
```

### Test
Testing chrome extension with [Puppeter](https://github.com/GoogleChrome/puppeteer).
```bash
$ npm run test
```

### Upload
We use [chrome-webstore-manager](https://github.com/pastak/chrome-webstore-manager), and wrap publish process in bash.
```bash
$ export CLIENT_ID=your_client_id
$ export CLIENT_SECRET=your_client_secret
$ export REFRESH_TOKEN=your_refresh_token
$ ./publish.sh
```