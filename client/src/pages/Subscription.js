import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import BackButton from '../components/BackButton';

function Subscription() {
  const history = useHistory();
  const [profileDetails, setProfileDetails] = useState({
    firstName: '',
    lastName: '',
    experience: '',
    education: ''
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [user, setUser] = useState(null);

  const plans = [
    { title: 'STUDENT', price: 0, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { title: 'RECRUITER', price: 0, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { title: 'BUSINESS', price: 0, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' },
  ];

  // Check if profile is already completed
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(data);
        if (data.profile.isCompleted) {
          history.push('/dashboard'); // Redirect to dashboard if profile is completed
        } else {
          setShowProfileForm(true); // Show profile form if not completed
        }
      } catch (error) {
        alert('Failed to fetch user data!');
        console.error(error);
      }
    };
    fetchUser();
  }, [history]);

  const handleProfileSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/update-profile`,
        { profile: profileDetails },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Profile details saved successfully!');
      setShowProfileForm(false);
      history.push('/dashboard'); // Redirect to dashboard after saving profile
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save profile details!');
    }
  };

  const handleSubscription = async (plan) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShowProfileForm(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Subscription failed!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg">
        <BackButton />
        <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
          Choose Your ZvertexAI Subscription
        </Typography>
        <Typography align="center" sx={{ mb: 5, color: 'white', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Select a plan tailored to your career or business needs.
        </Typography>
        {!showProfileForm ? (
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan) => (
              <Grid item key={plan.title} xs={12} sm={4}>
                <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#1a2a44', fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>{plan.title}</Typography>
                  <Typography variant="h4" sx={{ my: 2, color: '#1a2a44', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    ${plan.price}<Typography component="span" variant="body2">/month</Typography>
                  </Typography>
                  <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>{plan.resumes} Resume(s)</Typography>
                  <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>{plan.submissions} Submissions/Day</Typography>
                  <Typography sx={{ mt: 2, color: '#757575', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{plan.description}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    onClick={() => handleSubscription(plan)}
                  >
                    Choose Plan
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mt: 4 }}>
            <Typography variant="h5" sx={{ color: '#1a2a44', mb: 3, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Complete Your Profile
            </Typography>
            <TextField
              label="First Name"
              fullWidth
              value={profileDetails.firstName}
              onChange={(e) => setProfileDetails({ ...profileDetails, firstName: e.target.value })}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Last Name"
              fullWidth
              value={profileDetails.lastName}
              onChange={(e) => setProfileDetails({ ...profileDetails, lastName: e.target.value })}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Years of Experience"
              fullWidth
              value={profileDetails.experience}
              onChange={(e) => setProfileDetails({ ...profileDetails, experience: e.target.value })}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Education"
              fullWidth
              value={profileDetails.education}
              onChange={(e) => setProfileDetails({ ...profileDetails, education: e.target.value })}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}
              onClick={handleProfileSubmit}
              fullWidth
            >
              Save Profile & Proceed to Dashboard
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Subscription;