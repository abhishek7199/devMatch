const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhishek77882:abhi172@cluster0.vutj8rr.mongodb.net/?appName=Cluster0");
}

module.exports = connectDB;
