import React from 'react';
import Grid from "@material-ui/core/Grid";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import {useStyles} from './style'
import { ThemeProvider } from '@material-ui/core/styles';

import './App.css';
import SO2Emission from './Pages/SO2Emission/SO2Emission';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme();

function TabPanel({children, current, index, ...props}) {
    return (
        <div
            role="tabpanel"
            hidden={current !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...props}
        >
            {current === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function App() {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = React.useState(0);

    function handleSelectTab(event, newIndex) {
        setSelectedTab(newIndex);
    }

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Grid container>
                    <Grid item lg={3} md={2} xs={false}/>
                    <Grid item lg={6} md={8} xs={12}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleSelectTab}
                            aria-label="simple tabs example"
                            variant="fullWidth"
                        >
                            <Tab label="SO2 Emission" id={'tab-1'} aria-controls={'tabpanel-1'}/>
                            <Tab label="Item Two" id={'tab-2'} aria-controls={'tabpanel-2'}/>
                        </Tabs>
                        <TabPanel current={selectedTab} index={0}>
                            <SO2Emission/>
                        </TabPanel>
                        <TabPanel current={selectedTab} index={1}>
                        </TabPanel>
                        <Box>
                            Powered by Andrieiev Danil & Demchyshyn Andrey (C)2020
                        </Box>
                    </Grid>
                    <Grid item lg={3} md={2} xs={false}/>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default App;
