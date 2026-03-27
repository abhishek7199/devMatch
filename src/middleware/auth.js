const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).send("Unauthorized: Token missing");
        }

        // Verify token
        const decodedObj = jwt.verify(token, "DEV@Tinder$790");

        const user = await User.findById(decodedObj._id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user; // Attach user to request object
        next();

    } catch (err) {
        res.status(401).send("Invalid Token");
    }
};

module.exports = { userAuth };
