'use client '
import { Box, Typography, AppBar, Toolbar, Grid, Card, CardContent } from '@mui/material';
import { React } from 'react';
import styles from '../css/Dashboard.module.css'

function Dashboard(){
    
    return (
        <Box className={styles.mainApp}>
            {/** Navbar at the top of the window */}
            <AppBar position="fixed" className={styles.topNavbar}>
                <Toolbar sx={{ justifyContent: 'flex-start', pl:2}}>
                    <Typography>GitLogz</Typography>
                </Toolbar>
            </AppBar>
            {/** Menu bar handling the input of the repository and the branch */}
            <AppBar position="fixed" className={styles.bottomNavbar}>
                <Toolbar sx={{ justifyContent: 'flex-start', pl:2}}>
                    <Typography>Repository</Typography>
                    <Typography>Branch</Typography>
                </Toolbar>
            </AppBar>
            {/**Main dashboard area */}
            <Box className={styles.analysis}>
                <Typography>Dashboard</Typography>
                {/**First to rows utilise a grid with 0 x spacing, bottom row is a separate box*/}
                <Grid container>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Overall rating
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Code coverage
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Reliability
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Languages
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Vulnerabilities
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Code issues
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Security hotspots
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography>
                                    Known bugs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Card>
                    <CardContent>
                        <Typography>
                            KPI GRAPH
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default Dashboard;