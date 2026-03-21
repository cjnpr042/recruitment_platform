import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;
const startApp = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Critical Error:", error.message);
    process.exit(1);
  }
};

startApp();
