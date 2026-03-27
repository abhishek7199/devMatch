const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");

profileRouter.get("/profile", userAuth, async (req, res) => {
    const userEmail = req.user.emailId;

    try {
        const users = await User.find({ emailId: userEmail });

        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        res.send("Profile updated successfully");

    } catch (e) {
        res.status(400).send("Error: " + e.message);
    }
});

module.exports = profileRouter;