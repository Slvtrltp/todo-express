import express, { raw, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model.js";
import { auth } from "../auth-middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { username, password } = req.body;
  const existingUsers = await UserModel.findOne({ username: username });
  if (existingUsers) {
    return res.status(404).send({ message: "Username already existed" });
  }
  if (password === "") {
    return res.status(404).send({ message: "Нууц үгээ оруулна уу!" });
  }
  if (username.trim() === "") {
    return res.status(404).send({ message: "Хэрэглэгчийн нэрээ оруулна уу!" });
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return res.status.send({
      message: "Хэрэглэгчийн нэр зөвхөн жижиг үсэг, тоо, _ агуулах ёстой.",
    });
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
    const errors = [];
    if (password.length < 8) errors.push("•8 тэмдэгт байх ёстой.");
    if (!/[A-Z]/.test(password)) errors.push("•1 том үсэг агуулах ёстой.");
    if (!/[a-z]/.test(password)) errors.push("•1 жижиг үсэн агуулагдах ёстой.");
    if (!/[0-9]/.test(password)) errors.push("•1 тоо агуулах ёстой.");
    if (!/[!@#$%^&*]/.test(password))
      errors.push("•1 тусгай тэмдэгт агуулах ёстой.");
    const errorPassword =
      "Нууц үг нь дараах шаардлагуудыг хангасан байх ёстой. \n " +
      errors.join("\n");
    return res.send(errorPassword);
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUsers = await UserModel.create({
    username,
    password: hashedPassword,
  });
  return res.send(newUsers);
});
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const existingUsers = await UserModel.findOne({ username: username });

  if (!username || !password) {
    return res
      .status(404)
      .send({ message: "Body must have username and password" });
  }

  if (!existingUsers) {
    return res.status(404).send({ message: "Wrong credentials" });
  }
  const isMatching = bcrypt.compareSync(password, existingUsers.password);
  if (!isMatching) {
    return res.status(404).send({ message: "Wrong credetials" });
  }

  const { password: hashedPassword, ...userWithoutPassword } =
    existingUsers.toJSON();
  const accessToken = jwt.sign(userWithoutPassword, "MySecret", {
    expiresIn: "1d",
  });

  return res.send({ message: "Successfully signedin", accessToken });
});
router.get("/me", auth, (req, res) => {
  return res.send(req.user);
});

export default router;
