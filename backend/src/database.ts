import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function initializeDatabase() {
  const db = await open({
    // Use an absolute path to ensure the db file is always in the same place
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      questionId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  console.log('Database initialized and tables created.');
  return db;
}
