import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SocketServer from './lib/socket';

import authRoutes from './routes/auth.route';
import uploadRoutes from './routes/upload.route';

/* CONFIGURATION */
dotenv.config();

const PORT = 5000;
const CROSS_ORIGIN = ['http://localhost:5173'];

const socketServer = new SocketServer(PORT, CROSS_ORIGIN);

const app = socketServer.getApp();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
/* CONFIGURATION */

/* ROUTES */

app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes);
app.use('api/upload', uploadRoutes);

/* ROUTES */
