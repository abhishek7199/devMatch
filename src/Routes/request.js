const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/request", (req, res) => {
    return res.status(400).send("This is request handler route");
}
);

module.exports = requestRouter;