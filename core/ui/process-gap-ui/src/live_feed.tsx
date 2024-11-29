import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

interface LiveData {
  system_states: { time: string; shift: string };
  biometric_data: Record<string, number>;
  personnel_info: Record<string, number>;
  software_values: Record<string, number>;
  hardware_load: Record<string, number>;
  current_risk: { level: number; status: string };
}

const LiveFeed: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch live data from the mock API endpoint
      fetch("http://127.0.0.1:8000/api/live-feed")
        .then((response) => response.json())
        .then((data) => {
          setLiveData(data);  // Update live data
        })
        .catch((error) => console.error("Failed to fetch live feed data:", error));
    }, 1000);  // Fetch every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!liveData) {
    return <Typography>Loading live feed...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Live Feed
      </Typography>

      {/* System States */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">System States</Typography>
        <Typography>Current Time: {liveData.system_states.time}</Typography>
        <Typography>Current Shift: {liveData.system_states.shift}</Typography>
      </Paper>

      {/* Live Feeds */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Live Feeds</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Biometric Data</Typography>
            {Object.entries(liveData.biometric_data).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value.toFixed(2)}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Personnel Information</Typography>
            {Object.entries(liveData.personnel_info).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value.toFixed(2)}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Software Values</Typography>
            {Object.entries(liveData.software_values).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value.toFixed(2)}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Hardware Load</Typography>
            {Object.entries(liveData.hardware_load).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value.toFixed(2)}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Paper>

      {/* Current Risk */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Current Risk</Typography>
        <Typography>Risk Level: {liveData.current_risk.level}%</Typography>
        <Typography>Status: {liveData.current_risk.status}</Typography>
      </Paper>
    </Box>
  );
};

export default LiveFeed;
