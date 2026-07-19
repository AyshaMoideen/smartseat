const mongoose = require("mongoose");
require("dotenv").config();

console.log("URI loaded:", process.env.MONGO_URI ? "YES" : "NO");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
    process.exit(0);
})
.catch((err) => {
    console.error("❌ FULL ERROR:");
    console.error(err);
    process.exit(1);
});