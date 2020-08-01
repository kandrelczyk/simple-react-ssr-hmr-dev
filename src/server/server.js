import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import express from 'express'; // Same as our index.html. Replace data in it
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import controllers from './controllers';
import App from '../client/App';
import theme from '../client/theme';
import config from './config';

function renderFullPage(html, css, initialState) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=de vice-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>OpenTrivia.js</title>
        <style id="jss-server-side">
         ${css}
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
            window.INITIAL_STATE = ${JSON.stringify(initialState)};
        </script>
        <script src="/client.js"></script>
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

app.use('/', controllers);
app.get('*', (req, res) => {
  const sheets = new ServerStyleSheets();
  const element = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>,
    ),
  );
  const css = sheets.toString();
  const renderedData = renderFullPage(element, css, { ssr: true });
  return res.send(renderedData);
});

app.set('port', config.port || 3000);

export default app;
