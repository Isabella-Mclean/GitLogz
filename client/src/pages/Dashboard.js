"use client";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import styles from "../css/Dashboard.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { postLink } from "../api";

function Dashboard() {
  const [repository, setRepository] = useState("");
  const [branch, setBranch] = useState("");
  const { logout, user, isAuthenticated, isLoading } = useAuth0();
  const [rating, setRating] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [reliability, setReliability] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState(0);
  const [issues, setIssues] = useState(0);
  const [bugs, setBugs] = useState(0);
  const [violations, setViolations] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      {
        /**If the page has loaded and the user is not authenticated, send them to the home page */
      }
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  {
    /**Should handle the change of the repository in the menu */
  }
  const handleChangeRepo = () => {
    console.log("Repository");
  };

  {
    /**Should handle the change of the branch in the menu */
  }
  const handleChangeBranch = () => {
    console.log("Branch");
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    const link = e.target[0].value;
    try {
      setRepository(link);
      setLoading(true);
      postLink(link).then((data) => {
        // setRepository(data.repository);
        console.log(typeof data.data.sonar_metrics.component.measures);
        data.data.sonar_metrics.component.measures.forEach((metric) => {
          if (metric.metric === "coverage") {
            setCoverage(metric.value);
          } else if (metric.metric === "reliability_rating") {
            setReliability(metric.value);
          } else if (metric.metric === "bugs") {
            setBugs(metric.value);
          } else if (metric.metric === "vulnerabilities") {
            setVulnerabilities(metric.value);
          } else if (metric.metric === "code_smells") {
            setIssues(metric.value);
          } else if (metric.metric === "violations") {
            setViolations(metric.value);
          }
        });

        setLanguages(data.data.languages);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className={styles.mainApp}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.mainApp}>
      {/** Navbar at the top of the window */}
      <AppBar position="fixed" className={styles.topNavbar}>
        <Toolbar sx={{ justifyContent: "flex-start", pl: 2 }}>
          <Typography>GitLogz</Typography>
          <Button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      {/** Menu bar handling the input of the repository and the branch */}
      <Box className={styles.bottomNavbar}>
        <Toolbar sx={{ justifyContent: "flex-start", pl: 2 }}>
          {/**Drop down menu for users to choose the repo they would like to view */}

          <FormControl
            className={styles.dropDown}
            style={{
              minWidth: "40vw",
              marginLeft: 5,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <form onSubmit={handleLinkSubmit}>
              <TextField
                type="text"
                placeholder="GitHub URL"
                sx={{
                  width: "40vw",
                  marginRight: 2,
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ marginLeft: 2, alignSelf: "center" }}
              >
                Analyze
              </Button>
            </form>
          </FormControl>
        </Toolbar>
      </Box>

      {/** Main dashboard area */}
      <Box className={styles.analysis}>
        <Typography variant="h6" className={styles.dashboardTitle} gutterBottom>
          Repository Dashboard
        </Typography>
        {/**First two rows utilize a grid with no spacing, bottom row is a separate box*/}
        <Grid container rowGap={10} className={styles.gridContainer}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Overall rating</Typography>
                <Typography>{rating}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Code coverage</Typography>
                <Typography>{coverage}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Reliability</Typography>
                <Typography>{reliability}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography gutterBottom>Languages</Typography>
                <Typography component={"ul"} mt={3}>
                  {Object.keys(languages).map((language) => (
                    <Typography component={"li"} key={language}>
                      {language}
                    </Typography>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Violations</Typography>
                <Typography>{violations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Vulnerabilities</Typography>
                <Typography>{vulnerabilities}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Code issues</Typography>
                <Typography>{issues}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.card}>
              <CardContent>
                <Typography>Known bugs</Typography>
                <Typography>{bugs}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
