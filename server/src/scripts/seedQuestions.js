import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

import Question from '../models/Question.js';
import { connectDB, disconnectDB } from '../utils/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const questionData = [
  {
    prompt: 'Which JavaScript method is used to convert JSON text into a JavaScript object?',
    options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'],
    correctIndex: 0,
    explanation: 'Use JSON.parse() to parse a JSON string. JSON.stringify() does the reverse.',
  },
  {
    prompt: 'Which HTTP status code indicates that the client is not authorized to access the resource?',
    options: ['200', '301', '401', '500'],
    correctIndex: 2,
    explanation: '401 Unauthorized signals authentication is required or failed.',
  },
  {
    prompt: 'In MongoDB, which operator is used to select documents where the value of a field is greater than a specified value?',
    options: ['$lt', '$gt', '$eq', '$regex'],
    correctIndex: 1,
    explanation: '$gt stands for “greater than”. $lt means less than, $eq equals, $regex pattern.',
  },
  {
    prompt: 'What React hook is primarily used to perform side effects in function components?',
    options: ['useState', 'useEffect', 'useMemo', 'useReducer'],
    correctIndex: 1,
    explanation: 'useEffect handles side effects; useState stores state, useMemo memoizes values.',
  },
  {
    prompt: 'Which CSS property controls the space between an element’s border and its content?',
    options: ['margin', 'padding', 'border-spacing', 'line-height'],
    correctIndex: 1,
    explanation: 'Padding adds inner space; margin controls outer space, border-spacing for tables.',
  },
];

const seedQuestions = async () => {
  try {
    await connectDB();
    await Question.deleteMany();
    await Question.insertMany(questionData);
    console.log(`Seeded ${questionData.length} questions.`); // eslint-disable-line no-console
  } catch (error) {
    console.error('Failed to seed questions', error); // eslint-disable-line no-console
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

seedQuestions();

