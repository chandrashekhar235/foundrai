import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const client = new OAuth2Client();
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log("Incoming Request:", req.body);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("Existing User:", existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("New User Created:", user);

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error: any) {
  console.error("========== SIGNUP ERROR ==========");
  console.error(error);
  console.error("MESSAGE:", error.message);
  console.error("STACK:", error.stack);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: error.message,
  });
}
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Login Request:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Google account users don't have a password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const googleLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { credential } = req.body;

    console.log("========== GOOGLE LOGIN ==========");
    console.log("Credential received:", !!credential);
    console.log(
      "Backend Google Client ID:",
      process.env.GOOGLE_CLIENT_ID
    );

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("Google payload:", payload);

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Token",
      });
    }

    const email = payload.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    const name = payload.name || "Google User";
    const avatar = payload.picture || "";

    console.log("Google user:", {
      email,
      name,
      avatar,
    });

    // Find existing user
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("Existing user:", user);

    // Create user if they don't exist
    if (!user) {
      console.log("Creating Google user...");

      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar,
        },
      });

      console.log("Google user created:", user);
    }

    // Generate FoundrAI JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    console.log("JWT generated successfully");

    return res.status(200).json({
      success: true,
      message: "Google Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error: any) {
    console.error("========== GOOGLE LOGIN ERROR ==========");
    console.error(error);
    console.error("Message:", error?.message);
    console.error("Name:", error?.name);
    console.error("Stack:", error?.stack);

    return res.status(500).json({
      success: false,
      message: "Google Authentication Failed",
      error: error?.message,
    });
  }
};