import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
    console.log("Startup data received:", req.body);

    res.json({
        message: "Startup analysis received successfully",
        data: req.body,
    });
});

export default router;