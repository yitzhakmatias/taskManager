import { Paper, Checkbox, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Task = { id: number; text: string; completed: boolean };
interface TaskCardProps {
  task: Task;
  onDeleteTask: (id: number) => void;
  onToggleTask: (id: number) => void;
}

export default function TaskCard({ task, onDeleteTask, onToggleTask }: TaskCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        bgcolor: task.completed ? "rgba(99,102,241,0.05)" : "background.paper",
        borderColor: task.completed ? "primary.dark" : "divider",
        transition: "all 0.18s ease",
        "&:hover": { bgcolor: "#22263A", borderColor: "rgba(255,255,255,0.15)" },
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggleTask(task.id)}
        color="primary"
        size="small"
      />
      <Typography
        variant="body1"
        sx={{
          flex: 1,
          color: task.completed ? "text.disabled" : "text.primary",
          textDecoration: task.completed ? "line-through" : "none",
          wordBreak: "break-word",
        }}
      >
        {task.text}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onDeleteTask(task.id)}
        color="error"
        sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
