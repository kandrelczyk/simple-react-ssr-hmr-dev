import React from 'react';
import loadable from '@loadable/component';
import {Route, Switch} from "react-router-dom";

const FirstComponent = loadable(() => import('./components/FirstComponent'))
const SecondComponent = loadable(() => import('./components/SecondComponent'))

const App = () =>
    <Switch>
        <Route exact path='/' component={FirstComponent} />
        <Route exact path='/second' component={SecondComponent} />
    </Switch>;

export default App;
