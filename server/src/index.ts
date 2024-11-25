import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import SocketServer from './lib/socket';

import authRoutes from './routes/auth.route';
import chatRoutes from './routes/chat.route';
import uploadRoutes from './routes/upload.route';

/* CONFIGURATION */
dotenv.config();

const PORT = 5000;
const CROSS_ORIGIN = 'http://localhost:5173';

const socketServer = new SocketServer(PORT, CROSS_ORIGIN);

const app = socketServer.getApp();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: CROSS_ORIGIN,
    credentials: true,
  })
);
/* CONFIGURATION */

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('api/upload', uploadRoutes);

app.use('/uploads', express.static('uploads'));
/* ROUTES */
