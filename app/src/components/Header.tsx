import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
      <Box>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: "linear-gradient(135deg, #818CF8, #6366F1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Task Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organiza tus tareas con React y TypeScript
        </Typography>
      </Box>
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        sx={{ borderRadius: 2 }}
      >
        Salir
      </Button>
    </Box>
  );
}
