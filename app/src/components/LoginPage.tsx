import { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Tabs, Tab, Alert, CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
  const [loading, setLoading] = useState(false);

  const isLogin = tab === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const { token } = await login(email, password);
        onLogin(token);
      } else {
        await register(name, email, password);
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
      <Paper elevation={4} sx={{ width: "100%", maxWidth: 420, p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
            <LockOutlinedIcon sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Task Manager</Typography>
          <Typography variant="body2" color="text.secondary">Gestiona tus tareas de forma segura</Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setError(""); }}
          variant="fullWidth"
          sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 } }}
        >
          <Tab label="Iniciar Sesion" />
          <Tab label="Registrarse" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!isLogin && (
            <TextField
              label="Nombre"
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : isLogin ? "Entrar" : "Crear cuenta"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
