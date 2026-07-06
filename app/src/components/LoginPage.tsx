import { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress, Tabs, Tab,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { login, register } from "../services/taskService";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = tab === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isLogin) {
        const { token } = await login(email, password);
        onLogin(token);
      } else {
        await register(name, email, password);
        setSuccess("Cuenta creada. Iniciando sesion...");
        const { token } = await login(email, password);
        onLogin(token);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", p: 2 }}>
      <Paper elevation={4} sx={{ width: "100%", maxWidth: 440, p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: isLogin ? "primary.main" : "success.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, transition: "background-color 0.3s" }}>
            {isLogin ? <LockOutlinedIcon sx={{ color: "#fff" }} /> : <PersonAddIcon sx={{ color: "#fff" }} />}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Task Manager</Typography>
          <Typography variant="body2" color="text.secondary">
            {isLogin ? "Gestiona tus tareas de forma segura" : "Crea tu cuenta para comenzar"}
          </Typography>
        </Box>

        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(""); setSuccess(""); }} variant="fullWidth" sx={{ mb: 3, borderRadius: 2, bgcolor: "action.hover" }}>
          <Tab label="Iniciar Sesion" sx={{ fontWeight: 600 }} />
          <Tab label="Registrarse" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!isLogin && (
            <TextField
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              size="small"
            />
          )}
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
          {success && <Alert severity="success" sx={{ py: 0 }}>{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            color={isLogin ? "primary" : "success"}
            disabled={loading}
            sx={{ mt: 1, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : isLogin ? "Entrar" : "Crear cuenta"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
          {isLogin ? "¿No tienes cuenta? Usa la pestana Registrarse" : "¿Ya tienes cuenta? Usa la pestana Iniciar Sesion"}
        </Typography>
      </Paper>
    </Box>
  );
}
