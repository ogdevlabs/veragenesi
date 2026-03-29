const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, firstName, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.register(email, firstName, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
