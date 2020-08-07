import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '@material-ui/core/styles';
import {loadableReady} from '@loadable/component'
import {BrowserRouter} from "react-router-dom";

import App from './App';
import theme from './theme';


function Main() {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </BrowserRouter>
    );
}

const renderMethod = window.INITIAL_STATE.ssr ? ReactDOM.hydrate : ReactDOM.render;

loadableReady(() => {
    renderMethod(<Main/>, document.querySelector('#root'));
});
