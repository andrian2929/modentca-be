const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const routes = require("./src/routes");
require("./src/config/firebase/firebase");
require("./src/config/db");

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(routes);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
