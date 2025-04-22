const projectRouter = require("./projectRoutes");

const mountRoutes = (app) => {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "API Working" });
  });

  app.use("/api/v1/projects", projectRouter);
};

module.exports = mountRoutes;
