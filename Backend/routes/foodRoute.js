import express from "express";
import { addFood , listFood , removeFood} from "../controllers/foodController.js";
import multer from "multer";
const app = express();
import path from "path";

const foodRouter = express.Router();


// image storage engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

// ✅ Serve images statically
app.use("/uploads", express.static("uploads"));

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list" , listFood );
foodRouter.post("/remove" , removeFood);

export default foodRouter;
