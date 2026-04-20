import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import contactRouter from './contact';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.use(contactRouter);

  const httpServer = createServer(app);

  return httpServer;
}
