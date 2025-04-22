const express = require("express");
const {
  getAllProjects,
  createProject,
  deleteProject,
  getProject,
  resizeProjectImage,
  updateProject,
  uploadProjectFiles,
  uploadProjectPDF,
} = require("../controllers/projectController");

const router = express.Router();

router
  .route("/")
  .get(getAllProjects)
  .post(
    uploadProjectFiles,
    resizeProjectImage,
    uploadProjectPDF,
    createProject
  );

router
  .route("/:id")
  .get(getProject)
  .patch(
    uploadProjectFiles,
    resizeProjectImage,
    uploadProjectPDF,
    updateProject
  )
  .delete(deleteProject);

module.exports = router;
