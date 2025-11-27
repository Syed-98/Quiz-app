import express from 'express';

import Question from '../models/Question.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const questions = await Question.find().select('-__v').lean();
    res.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions', error); // eslint-disable-line no-console
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

export default router;

