// const express = require("express")
// require('dotenv').config()
// const http = require("http");
// const { Server } = require("socket.io");
// const dbConnect = require('./config/dbconnect')
// const initRoutes = require('./routes')
// const cookieParser = require('cookie-parser')
// const cors = require('cors')

// const app = express()

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", // Chấp nhận mọi kết nối từ frontend
//     methods: ["GET", "POST"],
//   },
// });

// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     next();
// });

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     methods: ['POST', 'PUT', 'GET', 'DELETE'],
//     credentials: true
// }))

// let users = {}; // Theo dõi user đang kết nối (dựa trên socket ID)

// // Lắng nghe kết nối từ client
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Nhận thông tin user (khi user kết nối)
//   socket.on("register", (userType) => {
//     users[socket.id] = userType; // Lưu thông tin loại user (admin/user)
//     console.log(users);
//   });

//   // Nhận tin nhắn từ user/admin và gửi lại
//   socket.on("send_message", (data) => {
//     console.log("Message received: ", data);
//     io.emit("receive_message", data); // Gửi tin nhắn tới tất cả
//   });

//   // Xóa thông tin user khi disconnect
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     delete users[socket.id];
//   });
// });


// app.use(cookieParser())

// const port = process.env.PORT || 8888

// app.use(express.json())
// app.use(express.urlencoded({extended : true}))

// dbConnect()
// initRoutes(app)

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
// });

// app.use('/', (req, res) => {res.send('Server on')})

// app.listen(port, () => {
//     console.log('Server is running on port:', port)
// })

const express = require("express");
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require('./config/dbconnect');
const initRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Chỉ chấp nhận frontend từ CLIENT_URL
    methods: ["GET", "POST"],
    credentials: true, // Thêm credentials nếu cần
  },
});

// Middleware: CORS header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Middleware: CORS settings
app.use(cors({
  origin: process.env.CLIENT_URL, // Đảm bảo chỉ frontend của bạn có thể kết nối
  methods: ['POST', 'PUT', 'GET', 'DELETE'],
  credentials: true, // Cho phép cookie từ frontend
}));

// let users = {}; // Theo dõi người dùng dựa trên socket ID
let users = [];
// Lắng nghe kết nối từ client
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Nhận thông tin user khi kết nối (userType)
//   socket.on("register", (userType) => {
//     users[socket.id] = userType; // Lưu loại người dùng (admin/user)
//     console.log(`User ${socket.id} registered as ${userType}`);
//   });

//   // Nhận tin nhắn từ user/admin và gửi lại
//   socket.on("send_message", (data) => {
//     console.log("Message received: ", data);
//     try {
//       io.emit("receive_message", data); // Gửi tin nhắn tới tất cả người dùng
//     } catch (error) {
//       console.error("Error emitting message:", error);
//     }
//   });

//   // Xóa thông tin user khi disconnect
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     delete users[socket.id]; // Xóa người dùng khỏi danh sách
//   });

//   // Xử lý sự cố với socket
//   socket.on("error", (err) => {
//     console.error("Socket error: ", err);
//   });
// });

io.on("connection", (socket) => {
    // Đăng ký người dùng
    socket.on("register", (role) => {
      users.push({ socketId: socket.id, role });
    });
  
    // Nhận tin nhắn từ người dùng/admin và phát lại cho tất cả các kết nối khác
    socket.on("send_message", (data) => {
      // Gửi tin nhắn đến tất cả các client có vai trò khác
      io.emit("receive_message", data);
    });
  
    // Ngắt kết nối người dùng
    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id);
    });
  });





// Middleware cho cookie
app.use(cookieParser());

// Middleware cho express JSON và URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu
dbConnect();

// Khởi tạo các route
initRoutes(app);

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Route mặc định
app.use('/', (req, res) => {
  res.send('Server is running!');
});

// Lắng nghe cổng
const port = process.env.PORT || 8888;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
