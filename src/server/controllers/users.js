import express from 'express';

const router = express.Router();

router.get('/create', (req, res) => {
  res.send('Creating new user...');
});

export default router;
