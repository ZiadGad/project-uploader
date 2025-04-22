const express = require("express");
const Project = require("../models/projectModel");
const catchAsync = require("../utils/catchAsync.js");
const ApiError = require("../utils/ApiError");
const sharp = require("sharp");

const { uploadImageAndPDF } = require("../middlewares/uploadFiles.js");
const { s3Upload, s3Delete } = require("../utils/services/s3.js");

exports.uploadProjectFiles = uploadImageAndPDF();

exports.resizeProjectImage = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.image || !req.files.image[0]) return next();

  try {
    const buffer = await sharp(req.files.image[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const uploadResult = await s3Upload({
      originalname: `${req.files.image[0].originalname}`,
      buffer,
    });

    req.body.image = uploadResult.Location;
    next();
  } catch (err) {
    return next(new ApiError(`Error uploading image to S3`, 500));
  }
});

exports.uploadProjectPDF = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.pdfUrl || !req.files.pdfUrl[0]) return next();
  console.log(req.files.pdfUrl);

  try {
    const uploadResult = await s3Upload({
      originalname: `${req.files.pdfUrl[0].originalname}`,
      buffer: req.files.pdfUrl[0].buffer,
    });

    req.body.pdfUrl = uploadResult.Location;
    next();
  } catch (err) {
    return next(new ApiError(`Error uploading PDF to S3`, 500));
  }
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();
  res.status(200).json({
    results: projects.length,
    data: projects,
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return new ApiError("Project not found", 404);
  res.status(200).json({
    data: project,
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new ApiError("Project not found", 404));

  // Delete old image from S3 if there's a new one
  if (req.body.image && project.image) {
    const imageKey = project.image.split("/").pop();
    await s3Delete(imageKey);
  }

  if (req.body.pdfUrl && project.pdfUrl) {
    const pdfKey = project.pdfUrl.split("/").pop();
    await s3Delete(pdfKey);
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    data: updatedProject,
  });
});
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return next(new ApiError("Project not found", 404));

  if (project.image) {
    const imageKey = project.image.split("/").pop();
    await s3Delete(imageKey);
  }

  if (project.pdfUrl) {
    const pdfKey = project.pdfUrl.split("/").pop();
    await s3Delete(pdfKey);
  }

  res.status(204).json({
    data: null,
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create(req.body);
  res.status(201).json({
    data: project,
  });
});
