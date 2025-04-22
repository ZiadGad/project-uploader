const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Project must have a title"],
  },
  short_description: {
    type: String,
    trim: true,
    rquired: [true, "Project must have a short description"],
  },
  long_description: {
    type: String,
    trim: true,
    required: [true, "Project must have a long description"],
  },
  pdfUrl: {
    type: String,
    required: [true, "Project must have a pdf url"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "project must have image link"],
    trim: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
