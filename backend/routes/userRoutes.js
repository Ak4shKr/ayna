import { Router } from "express";
import {
  userLogin,
  userRegister,
  getMessages,
  deleteChatHistory,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/messages", getMessages);
router.delete("/messages", deleteChatHistory);
export default router;
