var createError = require("http-errors");
var express = require("express");
const http = require("http");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//pour dire que n'importe quel fichier ce trouve dans le dossier public je peux le renvoyer sur le serveur
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json("error");
});

const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', (client) => {
  console.log("socket is connected!");
  client.on('greeting', (user) => {
    client.emit("greeting", `hello ${user}`); // quand cette partie fait une emite, on de socket.on va etre activer
  });
});
server.listen(5000, () => {
  console.log("app is running on port 5000");
});
