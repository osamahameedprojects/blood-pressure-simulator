import React from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const accuracyData = [
  { name: 'Day 1', accuracy: 80 },
  { name: 'Day 2', accuracy: 85 },
  { name: 'Day 3', accuracy: 90 },
  { name: 'Day 4', accuracy: 95 },
  { name: 'Day 5', accuracy: 92 },
];

const badges = [
  { name: 'Speed Demon', earned: true },
  { name: 'Streak Master', earned: false },
  { name: 'Accuracy Ace', earned: true },
];

const Dashboard: React.FC = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={600} mb={3} align="center">
        Dashboard
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} justifyContent="center">
        <Box flex={2} minWidth={0}>
          <Paper elevation={3} sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" mb={2}>Accuracy Over Time</Typography>
            <Box height={240}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#3A7CA5" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
        <Box flex={1} minWidth={0} display="flex" flexDirection="column" gap={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Badges</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {badges.map((badge) => (
                <Chip
                  key={badge.name}
                  label={badge.name}
                  color={badge.earned ? 'success' : 'default'}
                  variant={badge.earned ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600, fontSize: '1rem' }}
                />
              ))}
            </Stack>
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Streak & Hint Meters</Typography>
            <Box minHeight={60} bgcolor="#f5f7fa" borderRadius={2} display="flex" alignItems="center" justifyContent="center">
              <Typography color="text.secondary">[Streak/Hint Meters Here]</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 