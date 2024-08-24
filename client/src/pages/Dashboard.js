import { Box, Typography } from '@mui/material';
import { React, useEffect } from 'react';


function Dashboard(){
    useEffect(() => {
        console.log("hello?")
      }, []);
    
    return (
        <Box>
            <Typography>Hello</Typography>
        </Box>
    );
}

export default Dashboard;