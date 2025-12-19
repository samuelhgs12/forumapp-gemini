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

// Main function to setup and start the server
async function main() {
  await initializeDatabase();
  console.log('Database schema initialized.');

  const dbFilePath = path.resolve(__dirname, '..', 'database.db');
  const db = await open({ filename: dbFilePath, driver: sqlite3.Database });
  app.locals.db = db; // Store db connection in app.locals

  console.log('Database connection opened and shared.');

  app.get('/', (req: Request, res: Response) => {
    res.send('ForumApp Backend is running!');
  });
  
  // GET all questions
  app.get('/api/questions', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const questions = await db.all('SELECT * FROM questions ORDER BY createdAt DESC');
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  // POST a new question
  app.post('/api/questions', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Question title is required' });
      }
      const result = await db.run('INSERT INTO questions (title) VALUES (?)', title);
      const newQuestion = await db.get('SELECT * FROM questions WHERE id = ?', result.lastID);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  // GET a single question with its answers
  app.get('/api/questions/:id', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const question = await db.get('SELECT * FROM questions WHERE id = ?', req.params.id);

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const answers = await db.all('SELECT * FROM answers WHERE questionId = ? ORDER BY createdAt ASC', req.params.id);
      
      res.json({ ...question, answers });
    } catch (error) {
      console.error(`Error fetching question ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch question details' });
    }
  });

  // POST a new answer to a question
  app.post('/api/questions/:id/answers', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const questionId = req.params.id;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Answer content is required' });
      }

      // Check if question exists
      const question = await db.get('SELECT * FROM questions WHERE id = ?', questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const result = await db.run('INSERT INTO answers (content, questionId) VALUES (?, ?)', [content, questionId]);
      const newAnswer = await db.get('SELECT * FROM answers WHERE id = ?', result.lastID);
      
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error(`Error adding answer to question ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to add answer' });
    }
  });

  // DELETE a question
  app.delete('/api/questions/:id', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const result = await db.run('DELETE FROM questions WHERE id = ?', req.params.id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error(`Error deleting question ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  // DELETE an answer
  app.delete('/api/answers/:id', async (req: Request, res: Response) => {
    try {
      const db = req.app.locals.db;
      const result = await db.run('DELETE FROM answers WHERE id = ?', req.params.id);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Answer not found' });
      }

      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error(`Error deleting answer ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to delete answer' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
