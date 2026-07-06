const express = require("express");
import { LoginUseCase } from "../../application/auth/login.use-case";
import { GetProfileUseCase } from "../../application/auth/get-profile.use-case";
import { RegisterUseCase } from "../../application/auth/register.use-case";

export function createAuthRouter(
  loginUseCase: LoginUseCase,
  getProfileUseCase: GetProfileUseCase,
  registerUseCase: RegisterUseCase
) {
  const router = express.Router();

  // POST /login
  router.post("/login", async (req: any, res: any) => {
    try {
      const { email, password } = req.body || {};
      const result = await loginUseCase.execute({ email, password });
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // POST /register
  router.post("/register", async (req: any, res: any) => {
    try {
      const { name, email, password } = req.body || {};
      const user = await registerUseCase.execute({ name, email, password });
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      const status = error.message === "Email already in use" ? 409 : 400;
      res.status(status).json({ message: error.message });
    }
  });

  // GET /profile — protected route
  router.get("/profile", (req: any, res: any) => {
    try {
      const authHeader = req.headers.authorization;
      const decoded = getProfileUseCase.execute(authHeader);
      res.json({ message: "Protected profile data", user: decoded });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  return router;
}
