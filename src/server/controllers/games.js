import express from 'express';

const router = express.Router();

router.get('/new', (req, res) => {
  res.send('Wolf, Fox, Eagle!');
});

export default router;
