import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = new express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;