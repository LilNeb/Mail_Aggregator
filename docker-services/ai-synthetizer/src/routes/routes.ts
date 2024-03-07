import express from 'express';
import { summarizeCategory } from '../controllers/summaryController';

const router = express.Router();

router.get('/summarize/:category/:limit', summarizeCategory);

export default router;