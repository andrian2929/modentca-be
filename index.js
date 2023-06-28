const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const routes = require("./src/routes");
require("./src/config/firebase/firebase");
require("./src/config/db");
require("./src/config/time");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(routes);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
