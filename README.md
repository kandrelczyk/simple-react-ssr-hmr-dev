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

    webpack --config webpack/webpack.config.client.js
Client development configuration is setup to output the client bundle into `build/public` directory
which is then served by the express server:

    if (process.env.NODE_ENV === 'development') {
      app.use(express.static('build/public'));
    }

Thanks to this the bundle can be loaded by the browser and the DOM can be hydrated by React.

The same client configuration can be used to start just the client using `webpack-dev-server`:

    webpack-dev-server --config webpack/webpack.config.client.js
    

#### Production

Production bundle can be created simply by combining both client and server webpack configurations:

    webpack --config webpack/webpack.config.prod.js
Check `webpack.config.prod.js` for details. Just like in development configuration, this outputs 
client bundle into the `build/public` directory (`public` relatively to the server bundle) which is 
then served by express:

    app.use(express.static('public'));

#### Styles

After trying out many different solutions I've decided to use Material-UI to create the styles. This
offers simple way for injecting styles into the HTML generated on server which works both 
for development and production. The setup process is described [here](https://material-ui.com/guides/server-rendering/).

#### Sharing state

To share the state between server and client the server does:

      <script>
        window.INITIAL_STATE = ${JSON.stringify(initialState)};
      </script>
      
On the client we can access this simply by doing:
    
    const renderMethod = window.INITIAL_STATE.ssr ? ReactDOM.hydrate : ReactDOM.render;
