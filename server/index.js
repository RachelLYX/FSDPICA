const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key", // Use a secret key for session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Let's save the earth!");
});

const authRoute = require("./routes/auth");
app.use("/auth", authRoute);

const programRoute = require("./routes/programs");
app.use("/programs", programRoute);

const volunteeringRoute = require("./routes/volunteering");
app.use("/volunteering", volunteeringRoute);

const { adminRouter } = require("./routes/AdminRoute"); 
app.use("/admin", adminRouter);

const { EmployeeRouter } = require("./routes/EmployeeRoute"); 
app.use("/employee", EmployeeRouter);


// routes for chat messages
const messageRoutes = require("./routes/chat.message.routes");
app.use("/api/messages", messageRoutes);

// routes for forum posts and threads
const forumRoutes = require("./routes/forum_routes/forum.routes");
app.use("/api/forums", forumRoutes);

// const models = require("./models");
// const db = models.db;
// const db2 = models.db2;

// // Synchronize both databases
// Promise.all([
//   db.sequelize.sync({ alter: true }),
//   db2.sequelize.sync({ alter: true })
// ])
// .then(() => {
//     let port = process.env.APP_PORT;
//     app.listen(port, () => {
//         console.log(`Server running on http://localhost:${port}`);
//     });
// })
// .catch((err) => {
//     console.error("Error synchronizing databases:", err);
// });

const db = require("./models");
db.sequelize.sync({ alter: true }).then(() => {
  let port = process.env.APP_PORT;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
