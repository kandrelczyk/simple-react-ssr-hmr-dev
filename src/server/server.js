import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import express from 'express'; // Same as our index.html. Replace data in it
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { ChunkExtractor } from '@loadable/server'
import path from 'path'
import fs from 'fs';
import controllers from './controllers';
import App from '../client/App';
import theme from '../client/theme';
import config from './config';

function renderFullPage(html, css, extractor, initialState) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=de vice-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>OpenTrivia.js</title>
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
        <style id="jss-server-side">
         ${css}
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
            window.INITIAL_STATE = ${JSON.stringify(initialState)};
        </script>
        ${extractor.getScriptTags()}
      </body>
    </html>
  `;
}

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(express.static('build/public'));
}

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let statsFile;
if (process.env.NODE_ENV === 'development') {
    let statsReady = false;
    while (!statsReady) {
        try {
            fs.statSync('./build/public/loadable-stats.json');
            statsReady = true;
        } catch (err) {
            console.log("Waiting for stats file.", err)

        }
    }
    statsFile = path.resolve('./build/public/loadable-stats.json');
} else {
    statsFile = path.resolve('./public/loadable-stats.json');
}
const extractor = new ChunkExtractor({ statsFile })

app.use('/', controllers);
app.get('*', (req, res) => {
    const jsx = extractor.collectChunks(
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>);
    const sheets = new ServerStyleSheets();
    const element = ReactDOMServer.renderToString(
        sheets.collect(jsx)
    );
    const css = sheets.toString();

    const scriptTags = extractor.getScriptTags();

    const renderedData = renderFullPage(element, css, extractor, { ssr: true });
    return res.send(renderedData);
});

app.set('port', config.port || 3000);

export default app;
