import mongoose, { Schema } from "mongoose";

interface Chat {
  messageId: string;
  userId: string;
  username: string;
  message: string;
}

const messsageSchema = new mongoose.Schema<Chat>({
  messageId: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
});

const Messages = mongoose.models.Messages || mongoose.model("Messages", messsageSchema);

export default Messages;