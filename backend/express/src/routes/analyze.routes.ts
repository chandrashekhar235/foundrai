import express from "express";
import { spawn } from "child_process";
import path from "path";

const router = express.Router();

router.post("/", (req, res) => {
    const startup = req.body;

    if (!startup) {
        return res.status(400).json({
            success: false,
            error: "Startup data is required",
        });
    }

    console.log("Starting FoundrAI analysis...");

    /*
     * Absolute path to the Python executable
     *
     * Your virtual environment is:
     * foundrAi/.venv/
     */
    const pythonPath =
        "/Users/sahil/Documents/foundrAi/.venv/bin/python";

    /*
     * __dirname points to:
     *
     * foundrAi/backend/express/src/routes
     *
     * We need to reach:
     *
     * foundrAi/ai/main.py
     */
    const pythonScript = path.resolve(
        __dirname,
        "../../../../ai/main.py"
    );

    console.log("Python script:", pythonScript);

    const pythonProcess = spawn(
        pythonPath,
        [pythonScript]
    );

    let output = "";
    let errorOutput = "";

    // Receive normal output from Python
    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    // Receive errors/warnings from Python
    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    // Send startup data to Python
    pythonProcess.stdin.write(
        JSON.stringify(startup)
    );

    pythonProcess.stdin.end();

    // Python process finished
    pythonProcess.on("close", (code) => {

        console.log(
            "Python process exited with code:",
            code
        );

        if (code !== 0) {

            console.error(
                "Python error:",
                errorOutput
            );

            return res.status(500).json({
                success: false,
                error: "AI analysis failed",
                details: errorOutput,
            });
        }

        try {

            const result = JSON.parse(output);

            console.log(
                "FoundrAI analysis completed"
            );

            return res.json({
                success: true,
                data: result,
            });

        } catch (error) {

            console.error(
                "Could not parse Python response:",
                output
            );

            return res.status(500).json({
                success: false,
                error: "Invalid response from AI",
                raw: output,
            });
        }
    });
});

export default router;