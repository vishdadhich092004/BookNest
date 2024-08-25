import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    permissions: string[];
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export const checkPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ message: "No user LoggedIn" });
    if (req.user.permissions.includes(permission)) {
      return next();
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  };
};
export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ message: "No user LoggedIn" });
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  };
};
