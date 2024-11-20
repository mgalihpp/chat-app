import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import logger from './logger';

/**
 * Class representing a SocketServer.
 */
class SocketServer {
  private io: Server;
  private app: express.Application;
  private server: http.Server;
  private userSocketMap: Record<string, string>; // Stores {userId: socketId}

  /**
   * Create a SocketServer.
   * @param {number} port - The port number on which the server should listen.
   * @param {string[]} corsOrigin - List of allowed CORS origins.
   */
  constructor(port: number, corsOrigin: string[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: { origin: corsOrigin },
    });
    this.userSocketMap = {};

    this.initializeSocketEvents();
    this.startServer(port);
  }

  /**
   * Start the HTTP server.
   * @param {number} port - The port number on which the server should listen.
   * @private
   */
  private startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
    });
  }

  /**
   * Initialize socket events.
   * @private
   */
  private initializeSocketEvents(): void {
    this.io.on('connection', (socket) => {
      logger.info('A user connected with socket ID: ', socket.id);

      const userId = socket.handshake.query.userId as string;
      if (userId) {
        this.userSocketMap[userId] = socket.id;
        this.broadcastOnlineUsers();
      }

      socket.on('disconnect', () => {
        logger.info(`A user disconnected with socket ID: ${socket.id}`);
        if (userId) delete this.userSocketMap[userId];
        this.broadcastOnlineUsers();
      });
    });
  }

  /**
   * Broadcast the list of online users.
   * @private
   */
  private broadcastOnlineUsers(): void {
    const onlineUsers = Object.keys(this.userSocketMap);
    logger.info(`Broadcasting online users: ${JSON.stringify(onlineUsers)}`);
    this.io.emit('getOnlineUsers', onlineUsers);
  }

  /**
   * Get the socket ID for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {string | undefined} The socket ID of the user, or undefined if not found.
   */
  public getReceiverSocketId(userId: string): string | undefined {
    return this.userSocketMap[userId];
  }

  /**
   * Get the Express app instance.
   * @returns {express.Application} The Express app.
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Get the Socket.IO instance.
   * @returns {Server} The Socket.IO server.
   */
  public getIO(): Server {
    return this.io;
  }
}

export default SocketServer;

// // Initialize the SocketServer
// const corsOrigins = ["http://localhost:5173"];
// const socketServer = new SocketServer(3000, corsOrigins);

// // Export relevant instances for reuse
// export const { getApp, getIO } = socketServer;
