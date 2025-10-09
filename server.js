require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await connectDB();
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Ready to accept requests!`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.error("Server not started due to database connection failure");
    process.exit(1);
  }
};

startServer();
