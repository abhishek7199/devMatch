const mongoose = require("mongoose");
// const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        max: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    age: {
        type: Number,
        minLength: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about the user"
    },
    photoUrl: {
        type: String,
        default: "https://agnportfolio.vercel.app/img/profile-pic.jpg"
    }


}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign(

        { _id: user._id },
        "DEV@Tinder$790", // Secret Key
        // { expiresIn: "1d" }
    );

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;