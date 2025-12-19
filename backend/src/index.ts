import express, { Request, Response } from 'express';
import { initializeDatabase } from './database';
import questionRoutes from './routes/questionRoutes'; // Import question routes

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// CORS setup (basic for development) - will be improved later
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for now
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Initialize database and start server
initializeDatabase().then(db => {
  console.log('Database connected.');

  app.get('/', (req: Request, res: Response) => {
    res.send('ForumApp Backend is running and database is connected!');
  });

  // API routes
  app.use('/api/questions', questionRoutes); // Use question routes

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit process if DB connection fails
});
