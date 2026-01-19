const API_BASE = "http://localhost:3001/api";

export type Question = {
  id: number;
  title: string;
  description?: string;
  author: string;
  created_at: string;
};

export type Answer = {
  id: number;
  question_id: number;
  content: string;
  author: string;
  created_at: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: "Erro inesperado." }));
    throw new Error(message.message ?? "Erro inesperado.");
  }
  return response.json();
}

export async function listQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_BASE}/questions`);
  return handleResponse<Question[]>(response);
}

export async function createQuestion(payload: {
  title: string;
  description: string;
  author: string;
}): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Question>(response);
}

export async function deleteQuestion(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/questions/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    const message = await response.json().catch(() => ({ message: "Erro inesperado." }));
    throw new Error(message.message ?? "Erro inesperado.");
  }
}

export async function getQuestion(id: number): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions/${id}`);
  return handleResponse<Question>(response);
}

export async function listAnswers(questionId: number): Promise<Answer[]> {
  const response = await fetch(`${API_BASE}/questions/${questionId}/answers`);
  return handleResponse<Answer[]>(response);
}

export async function createAnswer(questionId: number, payload: { content: string; author: string }): Promise<Answer> {
  const response = await fetch(`${API_BASE}/questions/${questionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Answer>(response);
}

export async function deleteAnswer(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/answers/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    const message = await response.json().catch(() => ({ message: "Erro inesperado." }));
    throw new Error(message.message ?? "Erro inesperado.");
  }
}
