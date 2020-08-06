## Simple React with SSR & HMR

This is a simple implementation of React Server Side Rendering (SSR) with Hot Module Replacement (HMR).

### Motivation

When starting a new React project I've found many starters with SSR and HMR implemented but all of 
them were very generic solutions with large code bases. This made analysing the way this features are 
implemented in detail difficult. At the same time, simpler examples were often implementing only one solution
without explaining how other features can be added. I've created this project to serve as an easy to 
understand example of SSR with other basic features included. 

### How SSR works

In a basic React application the HTML is rendered by client by doing something like this:

    const element = <h1>Hello, world</h1>;
    ReactDOM.render(element, document.getElementById('root'));

This code is executed by the browser when client code is loaded. It's usually added to the page by
webpack using `HtmlWebpackPlugin` which adds a script tag to the `index.html` page:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>webpack App</title>
      </head>
      <body>
        <script src="client.js"></script>
      </body>
    </html>
So when `index.html` is loaded it executes the client code in `client.js` which renders the React element. 

The basic idea behind SSR is for the server to render the React elements and send the resulting
HTML to the browser. Browser will still load `client.js` bundle but this time client code will call

    ReactDOM.hydrate(element, document.getElementById('root'));
which will only attach event listeners to the existing DOM elements. 

All this means that for SSR to work we need:

- for the server to generate exactly the same HTML structure as the client, including style attributes 
and other dependencies
- for the client bundle to be available to the server 
- to share the state between server and client

I will now explain how I've achieved this for both development mode with HMR and production build that
can be run by node directly. 

Keep in mind that this is a minimal implementation barely separating the development and production 
configurations into different files but without actually implementing all the details which would be
required by a proper production build. 

#### Development 

To start the app in development mode run
    
    npm run start
This will start both the server and the client with HMR. For the server I'm suing `node-hot` package:

    NODE_ENV=development node-hot --config webpack/webpack.config.server.js
    
This takes webpack configuration and runs the resulting bundle with HMR. Thanks to this we can
use ES6 syntax in the sever code. As `node-hot` cannot perform HMR on the main module we have to create 
`index.js` file which starts the proper server and use it as entry in webpack configuration.

For the client we simply run 

    webpack --watch --config webpack/webpack.config.client.js
Client development configuration is setup to output the client bundle into `build-client` directory
which is then served by the express server:

    if (process.env.NODE_ENV === 'development') {
        app.use(express.static('build-client'));
    }

Thanks to this the bundle can be loaded by the browser and the DOM can be hydrated by React.

By adding `HtmlWebpackPlugin` and server configuration we can run the client using `webpack-dev-server`:

    webpack-dev-server --config webpack/webpack.config.client.dev.server.js
    

#### Production

Production bundle can be created simply by combining both client and server webpack configurations:

    webpack --config webpack/webpack.config.prod.js
Check `webpack.config.prod.js` for details. Just like in development configuration, this outputs 
client bundle into the `build/public` directory (`public` relatively to the server bundle) which is 
then served by express:

    app.use(express.static('public'));

#### Code splitting

Loadable components are used for code splitting. This is the state of the art solution at the time
of writing this and is not used in any of the starter projects I've seen. The setup is described
[here](https://loadable-components.com/docs/server-side-rendering/). The chunk extractor which
selects proper chunks depending on the rendered components requires `loadable-stats.json` file
generated when processing client bundle. To make it work in development mode the client bundle is
generated first and then both client and server processes are run in parallel:

    "start:server": "NODE_ENV=development node-hot --config webpack/webpack.config.server.js",
    "start:client-watch": "webpack --watch --config webpack/webpack.config.client.js",
    "start": "webpack --config webpack/webpack.config.client.js && npm-run-all --parallel start:client-watch start:server",

Because both client and server are using `CleanWebpackPlugin`, two different directories are used for 
client and server bundles. Depending on the NODE_ENV variable, server will load stats generated 
by development or production builds:

    if (process.env.NODE_ENV === 'development') {
        statsFile = path.resolve('./build-client/loadable-stats.json');
    } else {
        statsFile = path.resolve('./public/loadable-stats.json');
    }

#### Styles

Loadable components also splits CSS into chunks. To extract them `mini-css-extract-plugin` needs to
be added to webpack configuration. 

SSR implementation from Material-UI is also compatible with loadable components. 
The setup process is described [here](https://material-ui.com/guides/server-rendering/).

The idea behind both solutions is the same. When rendering elements all dependencies are 
gathered and can be accessed by the provided API. Those can be then injected into the HTML returned
by server. For loadable components use:

      const extractor = new ChunkExtractor({statsFile});
      const jsx = extractor.collectChunks(<App/>);
and then inside the HTML:

    <head>
       ${extractor.getLinkTags()}
       ${extractor.getStyleTags()}
     </head>
     <body>
       ${extractor.getScriptTags()}
     </body>
      
For Material-UI, first do:

      const sheets = new ServerStyleSheets();
      const element = ReactDOMServer.renderToString(
         sheets.collect(jsx)
      );
      const css = sheets.toString();

and inside HTML:

    <style id="jss-server-side">
       ${css}
    </style>
    
    
#### Routing

`react-router-dom` is compatible will all previously described solutions and adding it is 
straightforward. Simply use `StaticRouter` in the server and `BrowserRouter` in the client.
Loadable components will automatically only select chunks used by rendered `Route`. 
    
#### Sharing state

To share the state between server and client the server does:

      <script>
        window.INITIAL_STATE = ${JSON.stringify(initialState)};
      </script>
      
On the client we can access this simply by doing:
    
    const renderMethod = window.INITIAL_STATE.ssr ? ReactDOM.hydrate : ReactDOM.render;
