const jwt = require("jsonwebtoken");

export interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}

export class GetProfileUseCase {
  private readonly jwtSecret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined in environment");
    this.jwtSecret = secret;
  }

  execute(authHeader: string | undefined): DecodedToken {
    // NEW JWT CHANGE: No header at all — reject immediately.
    if (!authHeader) {
      throw new Error("No token provided");
    }

    // NEW JWT CHANGE: Header looks like "Bearer <token>" — take only the token part.
    const token = authHeader.split(" ")[1];

    try {
      // NEW JWT CHANGE: jwt.verify checks signature and expiry.
      const decoded = jwt.verify(token, this.jwtSecret) as DecodedToken;
      return decoded;
    } catch {
      throw new Error("Invalid token");
    }
  }
}
