const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.get("/user", async (req, res) => {
    const userEmail = req.query.emailId;

    try {
        const users = await User.find({ emailId: userEmail });

        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;


    try {

        const UPDATE_ALLOWED = ["photourl", "about", "gender", "age", "skills"];
        const isUPDATE_ALLOWED = Object.keys(data).every((k) => UPDATE_ALLOWED.includes(k));

        if (!isUPDATE_ALLOWED) {
            throw new Error("Update not allowed");
        }

        if (data.skills?.length > 10) {
            throw new Error("You can't add skills more than 10");
        }

        await User.findByIdAndUpdate(userId, data);
        res.send("Data updated successfully");

    } catch (err) {
        res.status(400).send("Something went wrong" + err);
    }
});

connectDB().then(() => {
    console.log("Database Connected Successfully");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777");
    });
}).catch((e) => {
    console.log("Database can not be connected");
    console.error("DB connection error:", e.message);
});