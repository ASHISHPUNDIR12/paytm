const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { Users } = require("../db");
const { JWT_SECRET } = require("../config");
const app = express();
app.use(express.json());

//zod input validation
const signUpBody = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
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
    return res.status(411).json({
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

// signin validation
const signInbody = zod.object({
  userName: string().email(),
  password: string().min(6),
});

router.post("/signin", async (req, res) => {
  const createPayload = req.body;
  const parsedPayload = signInbody.bodyParse(createPayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "wrong input",
    });
  }
  const user = await Users.findOne({
    userName: req.body.userName,
    password: req.body.password,
  });
  if (user) {
    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
      msg: token,
    });
    return;
  }

  res.status(411).json({
    msg: "error while logging in ",
  });
});
module.exports = router;
