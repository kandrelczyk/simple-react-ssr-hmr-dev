import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './SecondComponent.module.css';


const clickAction = () => {
    console.log("element clicked");
};

const App = () =>
        <Typography variant="h3">
            <div onClick={clickAction} className={styles.error}> Hello world!!</div>
        </Typography>;

export default App;
