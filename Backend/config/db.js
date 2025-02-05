import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://nirajmohate:niraj123@cluster0.ieklk.mongodb.net/food-del"
    )
    .then(() => console.log("DB connected"));
};
