const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const login = require("./login.js");
const router = require("./route.js");

const app = express();

app.use(express.static(path.join(__dirname, "./public"))); 

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", login);
app.use("/api", router);

app.listen(3000, () => console.log("Web server started on http://localhost:3000"));
