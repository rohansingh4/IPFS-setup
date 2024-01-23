import cors from "cors";
import express from "express";
import fs from "fs";
import { create } from "kubo-rpc-client";
import multer from "multer";
import path from "path";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const storage = multer.diskStorage({
  destination: "../storage/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("file");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve static files from the "storage" directory
app.use("/storage", express.static("storage"));

async function ipfsUpload(file) {
  const client = create({ url: "http://34.205.55.64:5001/api/v0" });
  const { cid } = await client.add(file);
  return cid;
}

async function uploadToS3(filePath, cid) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `files/${cid}`, // Adjust the Key as needed
    Body: fileContent,
  };

  await s3.upload(params).promise();
}

app.post("/upload", async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "File upload failed" });
      }

      const filePath = `../storage/${req.file.filename}`;
      const file = fs.readFileSync(filePath);

      // Upload to IPFS
      const cid = await ipfsUpload(file);

      // Upload to S3
      await uploadToS3(filePath, cid);

      res.json({ file: req.file.filename, cid });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
