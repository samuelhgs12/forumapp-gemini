import { Router, Request, Response } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const router = Router();

// GET all questions
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await open({
      filename: './src/database.db',
      driver: sqlite3.Database,
    });
    const questions = await db.all('SELECT * FROM questions ORDER BY createdAt DESC');
    res.json(questions);
    await db.close();
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST a new question
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Question title is required' });
    }

    const db = await open({
      filename: './src/database.db',
      driver: sqlite3.Database,
    });
    const result = await db.run('INSERT INTO questions (title) VALUES (?)', title);
    const newQuestion = await db.get('SELECT * FROM questions WHERE id = ?', result.lastID);
    res.status(201).json(newQuestion);
    await db.close();
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

export default router;
