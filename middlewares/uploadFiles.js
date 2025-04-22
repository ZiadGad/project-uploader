const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images and PDF files are allowed!", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

exports.uploadImageAndPDF = () =>
  multerOptions().fields([
    { name: "image", maxCount: 1 },
    { name: "pdfUrl", maxCount: 1 },
  ]);
