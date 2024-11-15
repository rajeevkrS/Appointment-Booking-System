import express, { Router } from "express";
import { registerUser } from "../controllers/userController.js";

const userRouter = new express.Router();

userRouter.post("/register", registerUser);

export default userRouter;
