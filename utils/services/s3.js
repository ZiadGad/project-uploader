const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const s3Client = require("../../config/awsS3");
const ApiError = require("../ApiError");

exports.s3Upload = async (file) => {
  //   const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}-${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.MY_AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    return {
      Location: `https://${params.Bucket}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${params.Key}`,
      ...response,
    };
  } catch (err) {
    console.error("S3 Upload Error:", err);
    return new ApiError("Error uploading file to S3", 500);
  }
};

exports.s3Delete = async (key) => {
  try {
    const params = {
      Bucket: process.env.MY_AWS_S3_BUCKET,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return { status: 204 };
  } catch (err) {
    console.error("S3 Delete Error:", err);
    return new ApiError("Error deleteing file", 500);
  }
};
