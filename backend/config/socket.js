import { Server } from "socket.io";
import http from "http";
import Message from "../models/messages.js";
import mongoose from "mongoose";

export const socket = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.LOCAL_FRONTEND,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", async (msg) => {
      try {
        const userMessage = new Message({
          user: new mongoose.Types.ObjectId(msg.senderId),
          text: msg.text,
          sender: msg.sender,
        });
        await userMessage.save();

        io.emit("message", {
          sender: msg.sender,
          text: msg.text,
        });

        setTimeout(() => {
          io.emit("message", {
            sender: "server",
            text: msg.text,
          });
        }, 500);
        const serverMessage = new Message({
          user: new mongoose.Types.ObjectId(msg.senderId),
          text: msg.text,
          sender: "server",
        });
        await serverMessage.save();
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return server;
};
