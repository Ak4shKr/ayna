import { Server } from "socket.io";
import http from "http";

export const socket = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", async (data) => {
      console.log("Message received:", data);
      socket.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return server;
};
