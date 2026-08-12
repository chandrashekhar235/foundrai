import { Router } from "express";
import { signup, login, googleLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
export default router;