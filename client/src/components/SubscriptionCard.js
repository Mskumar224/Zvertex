import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

function SubscriptionCard({ title, price, resumes, submissions, description, onSelect }) {
  return (
    <Card className="subscription-card card">
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h4" sx={{ my: 2 }}>
          ${price}<Typography component="span" variant="body2">/month</Typography>
        </Typography>
        <Typography>{resumes} Resume(s)</Typography>
        <Typography>{submissions} Submissions/Day</Typography>
        <Typography sx={{ mt: 2 }}>{description}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onSelect}
          className="back-button"
          sx={{ mt: 3, px: 4 }}
        >
          Choose Plan
        </Button>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCard;