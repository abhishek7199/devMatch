const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // Check if already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user with hashed password
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        const statusCode = err.message.includes("valid") || err.message.includes("exists") ? 400 : 500;
        return res.status(statusCode).json({ message: "Error: " + err.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // 🔹 Create a token for the user
            const token = user.getJWT();

            // Store the token in a cookie
            res.cookie("token", token, {
                httpOnly: true, // prevents frontend JS from accessing it
                secure: false,  // change to true for HTTPS
                sameSite: "lax",
                expires: new Date(Date.now() + 8 * 360000) // 8 hours expiration
            });

            return res.status(200).send("Login Successful!");
        } else {
            return res.status(400).send("Invalid Credentials");
        }

    } catch (err) {
        return res.status(500).send("Error: " + err.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("logout Successfully!!!!");
});


module.exports = authRouter;