import express, { Router } from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const usersData = fs.readFileSync("./user.json", "utf-8");

let users = JSON.parse(usersData);

const updateUserFile = () => {
  fs.writeFileSync("./user.json", JSON.stringify(users), "utf-8");
};

router.get("/", (req, res) => {
  return res.send(users);
});

router.post("/signup", (req, res) => {
  const body = req.body;

  if (password === "") {
    return res.status(404).send({ message: "Нууц үгээ оруулна уу!" });
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
    return errorPassword;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUsers = {
    id: nanoid(),
    username,
    password: hashedPassword,
  };
  users.push(newUsers);
  updateUserFile();
  return res.send(newUsers);
});
router.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).send({ message: "Username already exists" });
  }
  const existingUsers = users.find((username) => username === username);
  if (existingUsers) {
    return res.status(404).send({ message: "Username already existed" });
  }
  if (username.trim() === "") {
    return res.status(404).send({ message: "Хэрэглэгчийн нэрээ оруулна уу!" });
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return res.status.send({
      message: "Хэрэглэгчийн нэр зөвхөн жижиг үсэг, тоо, _ агуулах ёстой.",
    });
  }
  if (!extingUser) {
    return res.status(404).send({ message: "Wrong credentials" });
  }
  const extingUser = users.find((user) => user.username === username);
  const isMatching = bcrypt.compareSync(extingUser.password, password);
  if (!isMatching) {
    return res.status(404).send({ message: "Wrong credetials" });
  }

  const { password: hashedPassword, ...userWithoutPassword } = existingUsers;
  const accessToken = jwt.sign(userWithoutPassword, "My secret", {
    expiresIn: "1h",
  });

  return res.send({ message: "Successfully signedin", accessToken });
});
export default router;
