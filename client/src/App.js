'use client'
import styles from './App.module.css';
import { React, useEffect } from 'react';
import { ShootingStars } from "./components/ui/shooting-stars.tsx";
import { StarsBackground } from "./components/ui/stars-background.tsx";
import {Box, Typography, Stack, AppBar, Toolbar, Button, Grid, Card, CardContent, useTheme} from '@mui/material';

function App() {
  useEffect(() => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => console.log(data));
  }, []);

  const theme = useTheme();


  return (
    <Box className={styles.App}>
      <ShootingStars/>
      <StarsBackground/>
      <AppBar position="fixed" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'flex-end', pl:2}}>
            <Button variant="text" className="Button">
                <Typography variant="h6" sx={{ color: 'white', mx: 2 }}>Sign in</Typography>
            </Button>
            <Button variant="text">
                <Typography variant="h6" sx={{ color: 'white', mx: 2 }}>Log in</Typography>
            </Button>
          </Toolbar>
        </AppBar>
      <Stack direction={'column'} spacing={2} className={styles.Stack}>
        <Typography className={styles.AppHeader} style={{fontSize:"70px"}}>
        GitLogz
        </Typography>
        <Typography className={styles.Description} style={{fontSize:"30px"}}>
        Monitor, Analyze, Improve: Your Code Quality, Simplified
        </Typography>
        <Grid container className={styles.gridContainer} >
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card className={styles.Card}  sx={{ padding: theme.spacing(1) }}>  
              <CardContent>
                <Typography className={styles.cardText}>
                  Automated code analysis, triggered by commits and pull requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className={styles.Card}  sx={{ padding: theme.spacing(1) }}>
                <CardContent >
                  <Typography className={styles.cardText}>
                    Rest assured, you will be alerted when your code quality degrades
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className={styles.Card} sx={{ padding: theme.spacing(1) }}>
                <CardContent>
                  <Typography className={styles.cardText}>
                    Powered by SonarQube, a leader in code analysis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className={styles.Card} sx={{ padding: theme.spacing(1) }}>
                <CardContent>
                  <Typography className={styles.cardText}>
                    Robust data storage, so you can revise previous qualities
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
        </Grid>

        
      </Stack>
    </Box>
  );
}

export default App;
