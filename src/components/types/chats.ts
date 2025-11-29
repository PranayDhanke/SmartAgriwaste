export interface Chat {
  messageId: string;
  userId: string;
  username: string;
  message: string;
}

export interface Chats {
  messageId: string;
  userId: string;
  username: string;
  message: string;
  timestamp?: string;
}