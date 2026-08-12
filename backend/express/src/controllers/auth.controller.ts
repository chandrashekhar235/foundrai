import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

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

    // Extract user information
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google Token",
      });
    }

    const email = payload.email!;
    const name = payload.name!;
    const avatar = payload.picture || "";

    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Create a new user if they don't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar,
        },
      });
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

  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google Authentication Failed",
    });
  }
};