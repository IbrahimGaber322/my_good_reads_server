import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../secrets.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const tmpDir = path.join(__dirname, "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const tempFilePath = path.join(tmpDir, req.file.originalname);
  fs.writeFile(tempFilePath, req.file.buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save file" });
    }

    cloudinary.uploader
      .upload(tempFilePath, { resource_type: "raw" })
      .then((result) => {
        fs.unlinkSync(tempFilePath);
        req.filePath = result.secure_url;
        next();
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Failed to upload file to Cloudinary" });
      });
  });
};

export { upload, uploadMiddleware };
