'use client';
import { Box,Button, Typography, AppBar, Toolbar, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {React, useEffect, useState} from 'react';
import styles from '../css/Dashboard.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const [repository, setRepository]  = useState('')
    const [branch, setBranch]  = useState('')
    const { logout,user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() =>{
        if(!isLoading && !isAuthenticated){
            {/**If the page has loaded and the user is not authenticated, send them to the home page */}
            navigate('/');
        }
    },[isLoading, isAuthenticated, navigate]);

    {/**Should handle the change of the repository in the menu */}
    const handleChangeRepo = () =>{
        console.log("Repository")
    }

    {/**Should handle the change of the branch in the menu */}
    const handleChangeBranch = () =>{
        console.log("Branch")
    }

    
    return (
        <Box className={styles.mainApp}>
            {/** Navbar at the top of the window */}
            <AppBar position="fixed" className={styles.topNavbar}>
                <Toolbar sx={{ justifyContent: 'flex-start', pl: 2 }}>
                    <Typography>GitLogz</Typography>
                    <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                        Log out
                    </Button>
                </Toolbar>
            </AppBar>
            
            {/** Menu bar handling the input of the repository and the branch */}
            <Box className={styles.bottomNavbar}>
                <Toolbar sx={{ justifyContent: 'flex-start', pl: 2 }}>
                    {/**Drop down menu for users to choose the repo they would like to view */}
                    <FormControl className={styles.dropDown} style={{minWidth:"20vw", marginRight:"25px"}}>
                        <InputLabel className={styles.bootstrapInputLabel}>Repository</InputLabel>
                        <Select
                        value={repository}
                        label="Repository"
                        onChange={handleChangeRepo}
                        >
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem>
                        </Select>
                    </FormControl>

                    {/**Drop down menu for users to input the branch they would like to view */}
                    <FormControl className={styles.dropDown} style={{minWidth:"20vw"}}>
                        <InputLabel className={styles.bootstrapInputLabel}>Branch</InputLabel>
                        <Select
                        value={branch}
                        label="Branch"
                        onChange={handleChangeBranch}
                        >
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>
            </Box>
            
            {/** Main dashboard area */}
            <Box className={styles.analysis}>
                <Typography className={styles.dashboardTitle}>Repository Dashboard</Typography>
                {/**First two rows utilize a grid with no spacing, bottom row is a separate box*/}
                <Grid container rowGap={10}  className={styles.gridContainer}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Overall rating</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Code coverage</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Reliability</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Languages</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Vulnerabilities</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Code issues</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Security hotspots</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card className={styles.card}>
                            <CardContent>
                                <Typography>Known bugs</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Card className={styles.kpiCard}>
                    <CardContent>
                        <Typography>KPI summary</Typography>
                        <Box className={styles.kpiGraph}></Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default Dashboard;
