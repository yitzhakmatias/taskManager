import { Stack } from "@mui/material";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

type Task = { id: number; text: string; completed: boolean };
interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onToggleTask: (id: number) => void;
}

export default function TaskList({ tasks, onDeleteTask, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) return <EmptyState />;
  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDeleteTask={onDeleteTask} onToggleTask={onToggleTask} />
      ))}
    </Stack>
  );
}
