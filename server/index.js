import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import handleSocketConnection from './socket/socketHandlers.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin:'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, { cors: corsOptions });
io.on('connection', (socket) => handleSocketConnection(io, socket));

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
