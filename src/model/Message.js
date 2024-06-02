import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const messageModle =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModle;
