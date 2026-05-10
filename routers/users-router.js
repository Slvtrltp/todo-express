import express, { raw, Router } from "express";
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
  const { username, password } = req.body;
  const existingUsers = users.find((user) => user.username === username);
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
  const existingUsers = users.find((user) => user.username === username);

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

  const { password: hashedPassword, ...userWithoutPassword } = existingUsers;
  const accessToken = jwt.sign(userWithoutPassword, "MySecret", {
    expiresIn: "1h",
  });

  return res.send({ message: "Successfully signedin", accessToken });
});
router.get("/me", (req, res) => {
  const rawToken = req.headers.authorization;
  if (!rawToken.startsWith("Bearr"))
    return res.status(401).send({ message: "Invalid token" });
  const token = rawToken.split(" ")[1];
  console.log(token);
  let payLoad = null;
  try {
    payLoad = jwt.verify(token, "MySecret");
  } catch (e) {
    return res.status(401).send({ message: "Invalid token" });
  }
  const existingUsers = users.find((user) => user.id === payLoad.id);
  return res.send(existingUsers);
});

export default router;
