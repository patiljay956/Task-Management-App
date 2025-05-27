import app from "./app.js";

import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env",
});
const port = process.env.PORT || 4000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`✅ Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
        console.log("MongoDB connection Error ");
        process.exit(1);
    });
