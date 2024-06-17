import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AdminRepository from '../repository/AdminRepository';
import Encrypt from '../passwordRepository/hashpassword';
import { Admin } from '../../Domain/Admin';
import JWTToken from '../passwordRepository/jwtpassword';

// Dependency Injection for Middleware
const encrypt = new Encrypt();
const jwtToken = new JWTToken();
const adminRepo = new AdminRepository(encrypt);

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.adminJWT;

    if (!accessToken) {
      return res.status(401).json({ message: "Access Denied: No access token provided." });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET as string) as JwtPayload;
      req.adminId = decoded.adminId;

      const admin: Admin | null = await adminRepo.findById(decoded.adminId);
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies.adminRefreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: "Access Denied: No refresh token provided." });
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET as string) as JwtPayload;
          const admin: Admin | null = await adminRepo.findById(decodedRefresh.adminId);

          if (!admin || admin.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Not authorized, invalid refresh token' });
          }
          const newAccessToken = jwtToken.generateAccessToken(decodedRefresh.adminId, 'admin');
          res.cookie('adminJWT', newAccessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000
          });

          req.adminId = decodedRefresh.adminId;
          next();
        } catch (refreshErr) {
          return res.status(401).json({ message: 'Not authorized, invalid refresh token' });
        }
      } else {
        return res.status(401).json({ message: 'Not authorized, invalid access token' });
      }
    }
  } catch (error) {
    console.error('Error in protect middleware:', error);
    return res.status(401).json({ message: 'Not authorized, an error occurred' });
  }
};
