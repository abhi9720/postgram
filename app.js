if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  path = require("path"),
  socketEvents = require("./socketEvents"),
  cors = require("cors");

var corsOptions = {
  origin: process.env.ALLOW_CLIENT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to mongoDB");
  }
);

//==================== core policy ======================================
// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     process.env.ALLOW_CLIENT.split(",")
//   );
//   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

//====================== running port ==============
const port = process.env.PORT || 8800;

if (process.env.NODE_ENV !== "production") {
  app.use(express.static("client/build"));
}

const server = app.listen(port, () => {
  console.log("Server Started.........." + `http://localhost:${port}/`);
});

//============================== connecting socket

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ALLOW_CLIENT,
  },
});
socketEvents(io);

//==================================     middleware
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ================================ multer
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'public/images');
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, req.body.name);
// 	},
// });
// const upload = multer({ storage: storage });

// app.post('/api/upload', upload.single('file'), (req, res) => {
// 	try {
// 		return res.status(200).json('File uploded successfully');
// 	} catch (error) {
// 		console.error(error);
// 	}
// });

//======================================  routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/Post");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/Message");
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/conversation", conversationRoute);
app.use("/messages", messageRoute);

//==============================  port
// it can handle all kinds of error in my app any where it is trown
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
