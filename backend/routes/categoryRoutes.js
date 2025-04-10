// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

// List of predefined categories
const categories = [
  { name: 'Technology', description: 'All technology-related campaigns.' },
  { name: 'Education', description: 'Campaigns supporting education.' },
  { name: 'Healthcare', description: 'Campaigns for medical and healthcare support.' },
  { name: 'Art', description: 'Campaigns for art and creativity.' },
  { name: 'Environment', description: 'Campaigns to protect the environment.' },
  { name: 'Business', description: 'Business and startup-related campaigns.' },
  // Add more as needed
];

// Get all categories
router.get('/', (req, res) => {
  res.json(categories); // Return the predefined categories list
});

module.exports = router;
