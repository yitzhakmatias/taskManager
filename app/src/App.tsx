import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import {
  getTasks,
  createTask,
  toggleTask as toggleTaskService,
  deleteTask as deleteTaskService,
  type Task,
} from "./services/taskService";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (token) getTasks(token).then(setTasks);
  }, [token]);

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => { setToken(null); setTasks([]); };

  const addTask = async (text: string) => {
    if (!token) return;
    const newTask = await createTask(text, token);
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = async (id: number) => {
    if (!token) return;
    await deleteTaskService(id, token);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = async (id: number) => {
    if (!token) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await toggleTaskService(id, task.completed, token);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 5 }}>
      <Container maxWidth="sm">
        <Header onLogout={handleLogout} />
        <TaskInput onAddTask={addTask} />
        <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleTask={toggleTask} />
        <Footer tasks={tasks} />
      </Container>
    </Box>
  );
}

export default App;
