import { Server as HTTPServer } from "http";
import { Socket } from "net";
import { NextApiResponse } from "next";
import { Server as IoServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IoServer;
    };
  };
};
