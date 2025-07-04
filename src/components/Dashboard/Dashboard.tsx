import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Stack, 
  Card, 
  CardContent, 
  LinearProgress,
  Modal,
  Button,
  Fade,
  Grow
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, userProgress } = useUser();
  const location = useLocation();
  const [showBadgeCelebration, setShowBadgeCelebration] = React.useState(false);
  const [celebrationBadges, setCelebrationBadges] = React.useState<any[]>([]);

  // Check for badge celebration from navigation
  React.useEffect(() => {
    const state = location.state as any;
    if (state?.celebrateBadges && state?.newBadges?.length > 0) {
      setCelebrationBadges(state.newBadges);
      setShowBadgeCelebration(true);
      
      // Clear the navigation state to prevent re-showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleCloseBadgeCelebration = () => {
    setShowBadgeCelebration(false);
    setCelebrationBadges([]);
  };

  // Prepare accuracy data from real attempts
  const prepareAccuracyData = () => {
    if (!userProgress?.attempts.length) return [];
    
    const attempts = userProgress.attempts;
    const groupedByDay: Record<string, number[]> = {};
    
    attempts.forEach(attempt => {
      const day = new Date(attempt.timestamp).toLocaleDateString();
      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(attempt.accuracy);
    });
    
    return Object.entries(groupedByDay)
      .map(([day, accuracies]) => ({
        name: day,
        accuracy: Math.round(accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length)
      }))
      .slice(-7); // Last 7 days
  };

  // Prepare scenario performance data
  const prepareScenarioData = () => {
    if (!userProgress?.scenarios.length) return [];
    
    return userProgress.scenarios.map(scenario => ({
      name: scenario.scenarioName.split(' ')[0], // "Healthy", "Hypertensive", etc.
      attempts: scenario.attempts,
      correct: scenario.correctAttempts,
      accuracy: scenario.averageAccuracy
    }));
  };

  // Get recently earned badges (last 3 badges)
  const getRecentBadges = () => {
    if (!userProgress?.badges.length) return [];
    
    return userProgress.badges
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
      .slice(0, 3);
  };

  const accuracyData = prepareAccuracyData();
  const scenarioData = prepareScenarioData();
  const recentBadges = getRecentBadges();

  if (!userProgress) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h5" color="text.secondary">
          Loading your progress...
        </Typography>
      </Box>
    );
  }

  // Calculate current level progress
  const currentLevelXP = userProgress.experience % 100; // XP towards current level (0-99)
  const levelProgress = currentLevelXP; // Progress percentage for LinearProgress (0-99)
  const xpNeededForLevel = 100; // XP needed per level

  return (
    <Box p={4} sx={{ overflow: 'visible' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            mb={2}
            sx={{
              background: 'linear-gradient(45deg, #3A7CA5, #667eea)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🩺 Your Dashboard
          </Typography>
                    <Typography variant="h6" color="text.secondary" mb={3}>
            Welcome back, {user?.name}! Here's your training progress.
          </Typography>
        </Box>
      </motion.div>

      {/* Recently Earned Badges */}
      {recentBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box mb={4}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                border: '2px solid rgba(245, 158, 11, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography 
                variant="h5" 
                fontWeight={700} 
                mb={2} 
                textAlign="center"
                sx={{ color: '#92400e' }}
              >
                🎉 Recently Earned Badges!
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                {recentBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.3 + (index * 0.2),
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                                                 background: 'rgba(255, 255, 255, 0.95)',
                         boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
                         border: '2px solid rgba(245, 158, 11, 0.25)',
                        minWidth: 120,
                        position: 'relative',
                      }}
                    >
                      {/* Sparkle effect */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          position: 'absolute', 
                          top: -5, 
                          right: -5,
                          animation: 'sparkle 2s infinite'
                        }}
                      >
                        ✨
                      </Typography>
                      
                      <Typography variant="h2" mb={1}>
                        {badge.icon}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={700} 
                        textAlign="center"
                        sx={{ color: '#a16207' }}
                      >
                        {badge.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        textAlign="center"
                      >
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
              
              {/* Confetti-like decorations */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1rem',
                  opacity: 0.9,
                  animation: 'float 3s ease-in-out infinite 2s',
                  filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.4))',
                }}
              >
                ⭐
              </Box>
            </Paper>
          </Box>
        </motion.div>
      )}

      {/* Stats Overview */}
       <Box display="flex" flexWrap="wrap" gap={3} mb={4} justifyContent="center">
         <Box flex={{ xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' }} minWidth={200}>
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.1 }}
           >
             <Card sx={{ 
               textAlign: 'center', 
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%)',
               height: 140,
               display: 'flex',
               alignItems: 'center'
             }}>
               <CardContent sx={{ width: '100%', py: 2 }}>
                 <Typography variant="h4" fontWeight={700} color="white" mb={1}>
                   {userProgress.level}
                 </Typography>
                 <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
                   Current Level
                 </Typography>
                 <Box>
                   <LinearProgress 
                     variant="determinate" 
                     value={levelProgress} 
                     sx={{ 
                       bgcolor: 'rgba(255,255,255,0.3)',
                       '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                       height: 4,
                       borderRadius: 2,
                       mb: 0.5
                     }} 
                   />
                   <Typography variant="caption" color="rgba(255,255,255,0.8)">
                     {currentLevelXP}/{xpNeededForLevel} XP
                   </Typography>
                 </Box>
               </CardContent>
             </Card>
           </motion.div>
         </Box>

         <Box flex={{ xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' }} minWidth={200}>
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <Card sx={{ 
               textAlign: 'center', 
               background: 'linear-gradient(135deg, #4caf50 0%, #45a049 50%)',
               height: 140,
               display: 'flex',
               alignItems: 'center'
             }}>
               <CardContent sx={{ width: '100%', py: 2 }}>
                 <Typography variant="h4" fontWeight={700} color="white" mb={1}>
                   {userProgress.totalCorrect}
                 </Typography>
                 <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
                   Correct Attempts
                 </Typography>
                 <Typography variant="caption" color="rgba(255,255,255,0.8)">
                   out of {userProgress.totalAttempts} total
                 </Typography>
               </CardContent>
             </Card>
           </motion.div>
         </Box>

         <Box flex={{ xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' }} minWidth={200}>
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.3 }}
           >
             <Card sx={{ 
               textAlign: 'center', 
               background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 50%)',
               height: 140,
               display: 'flex',
               alignItems: 'center'
             }}>
               <CardContent sx={{ width: '100%', py: 2 }}>
                 <Typography variant="h4" fontWeight={700} color="white" mb={1}>
                   {userProgress.overallAccuracy}%
                 </Typography>
                 <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
                   Overall Accuracy
                 </Typography>
                 <Typography variant="caption" color="rgba(255,255,255,0.8)" sx={{ opacity: 0 }}>
                   placeholder for alignment
                 </Typography>
               </CardContent>
             </Card>
           </motion.div>
         </Box>

         <Box flex={{ xs: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 12px)' }} minWidth={200}>
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
           >
             <Card sx={{ 
               textAlign: 'center', 
               background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 50%)',
               height: 140,
               display: 'flex',
               alignItems: 'center'
             }}>
               <CardContent sx={{ width: '100%', py: 2 }}>
                 <Typography variant="h4" fontWeight={700} color="white" mb={1}>
                   {userProgress.currentStreak}
                 </Typography>
                 <Typography variant="body2" color="rgba(255,255,255,0.8)" mb={1}>
                   Current Streak
                 </Typography>
                 <Typography variant="caption" color="rgba(255,255,255,0.8)">
                   Best: {userProgress.bestStreak}
      </Typography>
               </CardContent>
             </Card>
           </motion.div>
         </Box>
       </Box>

             {/* Main Content */}
       <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} sx={{ overflow: 'visible' }}>
         {/* Accuracy Chart */}
        <Box flex={2} minWidth={0}>
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.5 }}
           >
             <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: 350 }}>
               <Typography variant="h6" fontWeight={600} mb={2} display="flex" alignItems="center">
                 📈 Accuracy Over Time
               </Typography>
               <Box height={280}>
                 {accuracyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                       <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: '#333', 
                           border: 'none', 
                           borderRadius: '8px',
                           color: 'white'
                         }} 
                       />
                       <Line 
                         type="monotone" 
                         dataKey="accuracy" 
                         stroke="#3A7CA5" 
                         strokeWidth={4} 
                         dot={{ r: 6, fill: '#3A7CA5' }}
                         activeDot={{ r: 8, fill: '#667eea' }}
                       />
                </LineChart>
              </ResponsiveContainer>
                 ) : (
                   <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                     <Typography color="text.secondary">
                       Start practicing to see your progress!
                     </Typography>
                   </Box>
                 )}
            </Box>
          </Paper>
           </motion.div>
         </Box>

                  {/* Badge Collection */}
         <Box flex={1} minWidth={0} sx={{ overflow: 'visible !important' }}>
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.6 }}
             style={{ overflow: 'visible' }}
           >
             <Paper elevation={4} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: 350, overflow: 'visible !important' }}>
               <Typography variant="h6" fontWeight={600} mb={2} display="flex" alignItems="center" justifyContent="center">
                 🏆 Badge Collection ({userProgress.badges.length}/5)
               </Typography>
                                <Box height={280} sx={{ overflowY: 'auto', overflowX: 'visible !important' }}>
                 {userProgress.badges.length > 0 ? (
                                        <Stack spacing={3} sx={{ overflow: 'visible', pb: 3 }}>
                       {userProgress.badges.map((badge, index) => (
                         <motion.div
                           key={badge.id}
                           initial={{ opacity: 0, scale: 0.8, x: 20 }}
                           animate={{ opacity: 1, scale: 1, x: 0 }}
                           transition={{ duration: 0.5, delay: 0.1 * index }}
                         >
                         <Box 
                           display="flex" 
                           alignItems="center" 
                           gap={2} 
                           p={2} 
                           borderRadius={2}
                           sx={{
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             color: 'white',
                             boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                             border: '2px solid rgba(255, 255, 255, 0.2)',
                           }}
                         >
                           <Box
                             sx={{
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               width: 50,
                               height: 50,
                               borderRadius: '50%',
                               background: 'rgba(255, 255, 255, 0.2)',
                               backdropFilter: 'blur(10px)',
                               fontSize: '1.5rem',
                             }}
                           >
                             {badge.icon}
                           </Box>
                           <Box flex={1}>
                             <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                               {badge.name}
                             </Typography>
                             <Typography variant="caption" sx={{ opacity: 0.9 }}>
                               {badge.description}
                             </Typography>
                             <Typography variant="caption" display="block" sx={{ opacity: 0.7, mt: 0.5 }}>
                               Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                             </Typography>
                           </Box>
                           <Box>
                             <Typography variant="h4" sx={{ opacity: 0.3 }}>
                               ✨
                             </Typography>
                           </Box>
                         </Box>
                       </motion.div>
                     ))}
                     
                     {/* Show upcoming badges */}
                     {userProgress.badges.length < 5 && (
                       <Box mt={2}>
                         <Typography variant="subtitle2" color="text.secondary" mb={1} textAlign="center">
                           🎯 Next Badge to Unlock:
                         </Typography>
                         <Box 
                           p={2} 
                           borderRadius={2}
                           sx={{
                             background: 'rgba(0, 0, 0, 0.05)',
                             border: '2px dashed rgba(0, 0, 0, 0.1)',
                             textAlign: 'center',
                           }}
                         >
                           <Typography variant="body2" color="text.secondary">
                             {userProgress.totalCorrect < 1 ? "🎯 First Success - Complete your first measurement" :
                              userProgress.totalCorrect < 5 ? "🏆 Accuracy Ace - Complete 5 correct measurements" :
                              userProgress.totalCorrect < 10 ? "💪 Hypertension Hero - Complete 10 correct measurements" :
                              userProgress.currentStreak < 5 ? "🔥 Streak Master - Get 5 correct in a row" :
                              "⭐ Precision Expert - Achieve 95%+ accuracy over 10 attempts"}
                           </Typography>
                         </Box>
                       </Box>
                     )}
                     
                     {/* All badges collected message */}
                     {userProgress.badges.length === 5 && (
                       <Box mt={2} textAlign="center">
                         <Typography variant="h4" sx={{ mb: 1 }}>
                           🎉
                         </Typography>
                         <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                           All Badges Collected!
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           You're a Blood Pressure Master!
                         </Typography>
                       </Box>
                     )}
                   </Stack>
                 ) : (
                   <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" textAlign="center">
                     <Typography variant="h3" mb={2} sx={{ opacity: 0.3 }}>
                       🏆
                     </Typography>
                     <Typography variant="h6" fontWeight={600} mb={1}>
                       No Badges Yet
                     </Typography>
                     <Typography color="text.secondary" mb={2}>
                       Complete your first measurement to earn your first badge!
                     </Typography>
                     <Box 
                       p={2} 
                       borderRadius={2}
                       sx={{
                         background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                         color: 'white',
                         boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                       }}
                     >
                       <Typography variant="subtitle2" fontWeight={600}>
                         🎯 First Success
                       </Typography>
                       <Typography variant="caption">
                         Ready to unlock!
                       </Typography>
                     </Box>
                   </Box>
                 )}
               </Box>
             </Paper>
           </motion.div>
         </Box>
              </Box>

       {/* Bottom Row */}
       <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mt={4}>
         {/* Performance by Scenario */}
         <Box flex={2} minWidth={0}>
           {scenarioData.length > 0 && (
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.7 }}
             >
               <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: 350 }}>
                 <Typography variant="h6" fontWeight={600} mb={2} display="flex" alignItems="center">
                   📊 Performance by Scenario
                 </Typography>
                 <Box height={280}>
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                       <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                       <YAxis tick={{ fontSize: 12 }} />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: '#333', 
                           border: 'none', 
                           borderRadius: '8px',
                           color: 'white'
                         }} 
                       />
                       <Bar dataKey="accuracy" fill="#3A7CA5" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </Box>
               </Paper>
             </motion.div>
           )}
        </Box>

         {/* Scenario Progress */}
         <Box flex={1} minWidth={0}>
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.8 }}
           >
             <Paper elevation={4} sx={{ p: 3, borderRadius: 3, height: 350 }}>
               <Typography variant="h6" fontWeight={600} mb={2}>
                 🎯 Scenario Progress
               </Typography>
               <Box height={280} sx={{ overflowY: 'auto' }}>
                 <Stack spacing={2}>
                   {userProgress.scenarios.map((scenario) => (
                     <Box key={scenario.scenarioKey}>
                       <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                         <Typography variant="subtitle2" fontWeight={600}>
                           {scenario.scenarioName}
                         </Typography>
                <Chip
                           label={scenario.unlocked ? 'Unlocked' : 'Locked'} 
                           size="small" 
                           color={scenario.unlocked ? 'success' : 'default'}
                           variant="outlined"
                         />
                       </Box>
                       <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                         <Typography variant="caption" color="text.secondary">
                           {scenario.correctAttempts}/{scenario.attempts} correct
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           {scenario.averageAccuracy}% avg
                         </Typography>
                       </Box>
                       <LinearProgress 
                         variant="determinate" 
                         value={scenario.attempts > 0 ? (scenario.correctAttempts / scenario.attempts) * 100 : 0}
                         sx={{ borderRadius: 1, height: 6 }}
                       />
                     </Box>
              ))}
            </Stack>
            </Box>
          </Paper>
           </motion.div>
        </Box>
      </Box>

      {/* Badge Celebration Modal */}
      <Modal
        open={showBadgeCelebration}
        onClose={handleCloseBadgeCelebration}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grow in={showBadgeCelebration} timeout={500}>
          <Box sx={{
            width: { xs: '90%', sm: 450 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <Typography variant="h4" fontWeight={700} mb={2} sx={{ color: '#92400e' }}>
              🎉 New Badges Earned!
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              You've earned {celebrationBadges.length} new badges!
            </Typography>
            <Box display="flex" flexDirection="column" gap={3} justifyContent="center" alignItems="center">
              {celebrationBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                      minWidth: 200,
                    }}
                  >
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {badge.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      {badge.name}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ opacity: 0.9 }}>
                      {badge.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                mt: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                }
              }}
              onClick={handleCloseBadgeCelebration}
            >
              🎊 Awesome! Continue
            </Button>
          </Box>
        </Grow>
      </Modal>
    </Box>
  );
};

export default Dashboard; 