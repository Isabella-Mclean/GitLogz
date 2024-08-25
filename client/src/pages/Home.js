'use client'
import styles from "../css/Home.module.css";
import { React,useState } from 'react';
import { ShootingStars } from "../components/ui/shooting-stars.tsx";
import { StarsBackground } from "../components/ui/stars-background.tsx";
import { doc, collection, getDoc, setDoc } from "firebase/firestore"; 
import {db} from "../firebase.js"
import {Box, Typography, Stack, AppBar, Toolbar, Button, Grid, Card, CardContent,Snackbar, Alert} from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  
  const handleEmailChange = (e) => setEmail(e.target.value);

  const { loginWithRedirect } = useAuth0();
  

  {/* Handles the submission of user emails for the waitlist */}
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setSnackbarMessage("Please enter a valid email.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    {/**Checking the firebase */}
    const docRef = doc(collection(db, 'users'), email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSnackbarMessage("You are already on the waitlist.");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } else {
      await setDoc(docRef, { email });
      setSnackbarMessage("You have been added to the waitlist!");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setEmail('');  // Clear the input field
    }
  };

  {/**Handling the opening and closing of the notification bar */}
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
      <Box className={styles.mainApp}>
        {/**Setting the background provided by Acerternity */}
        <ShootingStars className={styles.shootingStars}/>
        <StarsBackground className={styles.starsBackground}/>
        <Box>
        <AppBar position="fixed" sx={{ background: 'transparent', boxShadow: 'none' }} >
            <Toolbar sx={{ justifyContent: 'flex-end', pl:2}}>
              <Button variant="text" >
                  <Typography variant="h6" sx={{ color: 'white', mx: 2 }}>Sign up</Typography>
              </Button>
              <Button variant="text" onClick={() => loginWithRedirect()}>
                  <Typography variant="h6" sx={{ color: 'white', mx: 2 }}>Log in</Typography>
              </Button>
            </Toolbar>
          </AppBar>
        <Stack direction={'column'} spacing={2} className={styles.stackContainer}>
          {/**Title and description */}
          <Typography className={styles.appHeader} style={{fontSize:"70px"}}>
          GitLogz
          </Typography>

          <Typography className={styles.description} style={{fontSize:"30px"}}>
          Monitor, Analyze, Improve: Your Code Quality, Simplified
          </Typography>

          {/* Email Input and Button in the same container */}
          <Box marginBottom={30}>
          <form onSubmit={handleFormSubmit} 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '20px', 
              marginTop:"40px",
              }}>
              <div style={{ display: 'flex', alignItems: 'center', borderRadius: '50px', border: '2px solid #9FA7D4' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={handleEmailChange}
                  style={{
                    padding: '15px 15px 15px 20px',
                    fontSize: '15px',
                    border: 'none',  
                    borderRadius: '50px 0 0 50px',
                    outline: 'none',
                    background: 'transparent',
                    color: '#9FA7D4',
                    width: '250px', 
                  }}
                />
                <button 
                  type="submit" 
                  style={{
                    padding: '10px 20px',  
                    fontSize: '12px',
                    border: 'none',
                    borderRadius: '50px',  
                    background: '#9FA7D4',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    marginLeft: '-10px',  // Move button slightly to the left
                    transform: 'translateX(-10px)'  // Shifts the whole container 20px to the left
                  }}
                >
                  Join Waitlist
                </button>
              </div>
            </form>
            </Box>
            {/* Snackbar for notifications */}
            <Snackbar 
              open={snackbarOpen} 
              autoHideDuration={5000} 
              onClose={handleSnackbarClose}
            >
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
            {/**Grid containing the various features of GitLogz */}
          <Grid container className={styles.gridContainer}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className={styles.featureCard} >  
                <CardContent>
                  <Typography className={styles.cardText}>
                    Automated code analysis, triggered by commits and pull requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card className={styles.featureCard}  sx={{ padding: 1}}>
                  <CardContent >
                    <Typography className={styles.cardText}>
                      Rest assured, you will be alerted when your code quality degrades
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card className={styles.featureCard} sx={{ padding:1}}>
                  <CardContent>
                    <Typography className={styles.cardText}>
                      Powered by SonarQube, a leader in code analysis
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card className={styles.featureCard} sx={{ padding: 1}}>
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
      </Box>
  );
}

export default Home;
