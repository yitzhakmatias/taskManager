import { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { login } from "../services/taskService";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login(email, password);
      onLogin(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", p: 2 }}>
      <Paper elevation={4} sx={{ width: "100%", maxWidth: 420, p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
            <LockOutlinedIcon sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Task Manager</Typography>
          <Typography variant="body2" color="text.secondary">Gestiona tus tareas de forma segura</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Correo electronico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Contrasena"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="small"
          />
          {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
