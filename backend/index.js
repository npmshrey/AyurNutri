import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientsRouter from './routes/patients.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/patients', patientsRouter);

// (Optional) Serve frontend in production: (see notes later)
// import path from 'path'
// app.use(express.static(path.join(__dirname, '../client/build')))
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')))

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patient-db';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
