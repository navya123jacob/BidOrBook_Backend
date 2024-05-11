import jwt from 'jsonwebtoken';
import JWT from '../../use_case/interface/jwt';

class JWTToken implements JWT {
  generateAccessToken(userId: string, role: string): string {
    const accessKey = "Na@backend" || "access123456";
    const expiresIn = '1d'; // 1 day
    if (accessKey) {
      const accessToken: string = jwt.sign({ userId, role }, accessKey, { expiresIn });
      return accessToken;
    }
    throw new Error('Access token key is not defined!');
  }

  generateRefreshToken(userId: string): string {
    const refreshKey = "Na@backend" || "refresh123456";
    const expiresIn = '30d'; // 30 days
    if (refreshKey) {
      const refreshToken: string = jwt.sign({ userId }, refreshKey, { expiresIn });
      return refreshToken;
    }
    throw new Error('Refresh token key is not defined!');
  }
}

export default JWTToken;