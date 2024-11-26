// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   userId: { type: String, required: true }, // ID của user
//   userType: { type: String, enum: ["admin", "user"], required: true },
//   message: { type: String, required: true },
//   time: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;


const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // userId or adminId
  receiverId: { type: String, required: true }, // userId or adminId
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
