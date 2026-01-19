import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DB_PATH = new URL("../data/forumapp.db", import.meta.url).pathname;

export async function openDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec("PRAGMA foreign_keys = ON");
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tb_user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tb_question (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tb_answer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(question_id) REFERENCES tb_question(id) ON DELETE CASCADE
    );
  `);

  return db;
}
