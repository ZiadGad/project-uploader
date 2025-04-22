const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const ApiError = require("./utils/ApiError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

const mountRoutes = require("./routes/index");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
