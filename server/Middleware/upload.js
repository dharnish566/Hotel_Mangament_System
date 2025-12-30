import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rooms",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
export default upload;
