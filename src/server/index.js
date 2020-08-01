import app from './server';

const httpServer = app.listen(app.get('port'));
console.info(`Running server at port ${app.get('port')}`);
let currentApp = app;

if (module.hot) {
  module.hot.accept('./server', () => {
    httpServer.removeListener('request', currentApp);
    httpServer.on('request', app);
    currentApp = app;
  });
}
