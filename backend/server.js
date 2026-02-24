import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';

const app = express();
const port=4000;
// Middlewares
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: true,limit: '20mb' }));

//DB
connectDB();

// Routes
app.use("/api/doctors", doctorRouter);
 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

