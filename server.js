const express = require("express");
const connectDB = require("./config/db");
var path = require("path");
const cors = require("cors");
const runsocketio = require("./socket");
const app = express();

//Connect Database
connectDB();


//Init Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use(express.json({ extended: false }));
app.use(cors());
app.use(express.static("uploads"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/accesstokens", require("./routes/api/accesstokens"));
app.use("/api/upload", require("./routes/api/upload"));
app.use("/api/deck", require("./routes/api/deck"));
app.use("/api/game", require("./routes/api/game"));


// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
runsocketio(server);
