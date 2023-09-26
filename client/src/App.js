import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Grid, CssBaseline, Card, CardContent, Box } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import LiveVideo from './components/video';
import SensorData from './components/sensor';
import plantLogo from './images/plantLogo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#99A98F',
    },
    secondary: {
      main: '#C1D0B5',
    },
    background: {
      default: '#D6E8DB',
      paper: '#FFF8DE',
    },
  },
  typography: {},
});

function App() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    soil: null,
    light: null,
  });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('/api/sensor_data');
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);  // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <AppBar position="static">
          <Toolbar>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={plantLogo} alt="Plant Logo" style={{ width: '40px', marginRight: '10px' }} />
              <Typography variant="h6">Dashboard</Typography>
            </div>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LiveVideo />
          </Grid>

          <Grid item xs={12} sm={6}>
            {[
              { title: "Temperature", value: sensorData.temperature, unit: "°F" },
              { title: "Humidity", value: sensorData.humidity, unit: "%" },
              { title: "Soil Moisture", value: sensorData.soil, unit: "%" },
              { title: "Light", value: sensorData.light, unit: "lux" }
            ].map(sensor => (
              <Card key={sensor.title} style={{ marginBottom: '15px' }}>
                <CardContent>
                  <SensorData title={sensor.title} value={sensor.value} unit={sensor.unit} />
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Temperature (°F)</Typography>
                <LineChart width={400} height={150} data={sensorData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                </LineChart>
              </CardContent>
            </Card>

            <Card style={{ marginTop: '15px' }}>
              <CardContent>
                <Typography variant="h6">Humidity (%)</Typography>
                <LineChart width={400} height={150} data={sensorData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                </LineChart>
              </CardContent>
            </Card>

            <Card style={{ marginTop: '15px' }}>
              <CardContent>
                <Typography variant="h6">Soil Moisture (%)</Typography>
                <LineChart width={400} height={150} data={sensorData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="soil" stroke="#ff7300" />
                </LineChart>
              </CardContent>
            </Card>

            <Card style={{ marginTop: '15px' }}>
              <CardContent>
                <Typography variant="h6">Light (lux)</Typography>
                <LineChart width={400} height={150} data={sensorData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="light" stroke="#f34c56" />
                </LineChart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box style={{ position: 'fixed', right: '1rem', bottom: '1rem' }}>
          <Typography variant="body2">Built with React by Drew</Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

