require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();
const PORT = 3000;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

// GET / - health check
app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

// GET /tasks - get all tasks
app.get("/tasks", async (req: any, res: any) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// POST /tasks - create a task
app.post("/tasks", async (req: any, res: any) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const task = await prisma.task.create({
    data: { text: text.trim() },
  });

  res.status(201).json(task);
});

// PUT /tasks/:id - update a task
app.put("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  const { text, completed } = req.body;

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
    },
  });

  res.json(task);
});

// DELETE /tasks/:id - delete a task
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
