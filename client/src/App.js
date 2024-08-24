'use client'
import './App.css';
import { React, useEffect } from 'react';
import { ShootingStars } from "./components/ui/shooting-stars.tsx";
import { StarsBackground } from "./components/ui/stars-background.tsx";
import {Box, Typography, Stack} from '@mui/material';

function App() {
  useEffect(() => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => console.log(data));
}, []);

  return (

    <Box className="Box">
      <ShootingStars/>
      <StarsBackground/>
      <Stack className='Stack'>
        <Typography className='App-header'>
          GitLogz
        </Typography>
        <Typography className="Description">
          Monitor, Analyze, Improve: Your Code Quality, Simplified
        </Typography>
      </Stack>
    </Box>
  );
}

export default App;
