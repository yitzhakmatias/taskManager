const jwt = require("jsonwebtoken");

export function requireAuth(req: any, res: any, next: any): void {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Malformed authorization header" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
