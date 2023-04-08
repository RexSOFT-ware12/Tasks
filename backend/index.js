require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./server/db");
const userRoutes = require("./server/routes/users");
const authRoutes = require("./server/routes/auth");
const createTaskRoutes = require("./server/routes/createTask");
const getUserTaskRoutes = require("./server/routes/getUserTask");
const  updateTaskRoutes= require("./server/routes/updateTask");
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/createTask", createTaskRoutes);
app.use("/api/updateTask", updateTaskRoutes);
app.use("/api/getUserTask", getUserTaskRoutes);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
