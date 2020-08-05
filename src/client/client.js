import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';
import { loadableReady } from '@loadable/component'

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}
loadableReady(() => {
  const renderMethod = window.INITIAL_STATE.ssr ? ReactDOM.hydrate : ReactDOM.render;
  renderMethod(<Main />, document.querySelector('#root'));
});
