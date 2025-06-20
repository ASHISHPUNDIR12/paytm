const express = require("express");
const router = express.Router();
const zod = require("zod ");
const jwt = require("jsonwebtoken");
const { Users } = require("../db");
const { use } = require("react");
const { JWT_SECRET } = require("../config");

//zod input validation
const signUpBody = zod.object({
  userName: zod.String().email(),
  password: zod.String().min(6),
  firstName: zod.String(),
  lastName: zod.String(),
});

router.post("/signup", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = signUpBody.safeParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }
  const existingUser = await Users.findOne({
    userName: req.body.userName,
  });
  if (existingUser) {
    res.status(411).json({
      msg: "user already created",
    });
  }
  const user = await Users.create({
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.status(200).json({
    msg: "user created succesfully",
    token: token,
  });
});

module.exports = router;
