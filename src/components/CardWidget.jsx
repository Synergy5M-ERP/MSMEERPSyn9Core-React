// src/components/CardWidget.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CardWidget = ({ title, value, icon }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
        {icon && <div>{icon}</div>}
      </CardContent>
    </Card>
  );
};

export default CardWidget;
