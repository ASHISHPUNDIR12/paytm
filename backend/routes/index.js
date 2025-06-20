// create a express router
const express = require("express");
const userRouter = require("./user");
const router = express.Router();

router.get("/users", userRouter);
module.exports = router;
