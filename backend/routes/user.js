const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { Users } = require("../db");
const { JWT_SECRET } = require("../config");

// Zod input validation
const signUpBody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const parsedPayload = signUpBody.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(411).json({
        msg: "Invalid input",
        errors: parsedPayload.error.issues,
      });
    }

    const { username, password, firstName, lastName } = parsedPayload.data;

    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(411).json({
        msg: "User already exists",
      });
    }

    const user = await Users.create({
      username,
      password,
      firstName,
      lastName,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    return res.status(200).json({
      msg: "User created successfully",
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// Signin validation
const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});

router.post("/signin", async (req, res) => {
  try {
    const parsedPayload = signInBody.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(411).json({
        msg: "Wrong input",
        errors: parsedPayload.error.issues,
      });
    }

    const { username, password } = parsedPayload.data;

    const user = await Users.findOne({ username, password });

    if (user) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return res.json({ msg: token });
    }

    return res.status(411).json({
      msg: "Invalid username or password",
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
