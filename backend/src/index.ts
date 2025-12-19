import express, { Request, Response } from 'express';
import { initializeDatabase } from './database';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const dbFilePath = path.resolve(__dirname, '..', 'database.db');

// GET all questions
app.get('/api/questions', async (req: Request, res: Response) => {
  try {
    const db = await open({ filename: dbFilePath, driver: sqlite3.Database });
    const questions = await db.all('SELECT * FROM questions ORDER BY createdAt DESC');
    res.json(questions);
    await db.close();
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST a new question
app.post('/api/questions', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Question title is required' });
    }
    const db = await open({ filename: dbFilePath, driver: sqlite3.Database });
    const result = await db.run('INSERT INTO questions (title) VALUES (?)', title);
    const newQuestion = await db.get('SELECT * FROM questions WHERE id = ?', result.lastID);
    res.status(201).json(newQuestion);
    await db.close();
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});


initializeDatabase().then(() => {
  console.log('Database schema initialized.');
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
