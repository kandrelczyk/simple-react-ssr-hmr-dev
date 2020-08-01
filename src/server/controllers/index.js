import express from 'express';
import games from './games';

const router = express.Router();

router.use('/game/', games);

export default router;
