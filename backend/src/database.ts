import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initializeDatabase() {
  const db = await open({
    filename: './src/database.db', // Database file will be created in src/
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
