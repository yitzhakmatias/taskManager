const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string;
};

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders(token),
  });
  return response.json();
}

export async function createTask(text: string, token: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ text }),
  });
  return response.json();
}

export async function toggleTask(
  id: number,
  completed: boolean,
  token: string
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ completed: !completed }),
  });
  return response.json();
}

export async function deleteTask(id: number, token: string): Promise<void> {
  await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }
  return response.json();
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Register failed");
  }
}
