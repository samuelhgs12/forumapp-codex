import express from "express";
import cors from "cors";
import { openDb } from "./db";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/questions", async (_req, res) => {
  const db = await openDb();
  const questions = await db.all(
    "SELECT id, title, author, created_at FROM tb_question ORDER BY datetime(created_at) DESC"
  );
  res.json(questions);
});

app.post("/api/questions", async (req, res) => {
  const { title, description, author } = req.body as {
    title?: string;
    description?: string;
    author?: string;
  };

  if (!title || !description) {
    res.status(400).json({ message: "Título e descrição são obrigatórios." });
    return;
  }

  const db = await openDb();
  const createdAt = new Date().toISOString();
  const result = await db.run(
    "INSERT INTO tb_question (title, description, author, created_at) VALUES (?, ?, ?, ?)",
    title,
    description,
    author?.trim() || "Usuário",
    createdAt
  );

  res.status(201).json({
    id: result.lastID,
    title,
    description,
    author: author?.trim() || "Usuário",
    created_at: createdAt,
  });
});

app.get("/api/questions/:id", async (req, res) => {
  const db = await openDb();
  const question = await db.get(
    "SELECT id, title, description, author, created_at FROM tb_question WHERE id = ?",
    req.params.id
  );

  if (!question) {
    res.status(404).json({ message: "Pergunta não encontrada." });
    return;
  }

  res.json(question);
});

app.delete("/api/questions/:id", async (req, res) => {
  const db = await openDb();
  const result = await db.run("DELETE FROM tb_question WHERE id = ?", req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ message: "Pergunta não encontrada." });
    return;
  }

  res.status(204).send();
});

app.get("/api/questions/:id/answers", async (req, res) => {
  const db = await openDb();
  const answers = await db.all(
    "SELECT id, question_id, content, author, created_at FROM tb_answer WHERE question_id = ? ORDER BY datetime(created_at) DESC",
    req.params.id
  );
  res.json(answers);
});

app.post("/api/questions/:id/answers", async (req, res) => {
  const { content, author } = req.body as { content?: string; author?: string };

  if (!content) {
    res.status(400).json({ message: "Resposta é obrigatória." });
    return;
  }

  const db = await openDb();
  const question = await db.get("SELECT id FROM tb_question WHERE id = ?", req.params.id);
  if (!question) {
    res.status(404).json({ message: "Pergunta não encontrada." });
    return;
  }

  const createdAt = new Date().toISOString();
  const result = await db.run(
    "INSERT INTO tb_answer (question_id, content, author, created_at) VALUES (?, ?, ?, ?)",
    req.params.id,
    content,
    author?.trim() || "Usuário",
    createdAt
  );

  res.status(201).json({
    id: result.lastID,
    question_id: Number(req.params.id),
    content,
    author: author?.trim() || "Usuário",
    created_at: createdAt,
  });
});

app.delete("/api/answers/:id", async (req, res) => {
  const db = await openDb();
  const result = await db.run("DELETE FROM tb_answer WHERE id = ?", req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ message: "Resposta não encontrada." });
    return;
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
