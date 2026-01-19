<template>
  <section class="card">
    <h2>Adicionar pergunta</h2>
    <form class="form-grid" @submit.prevent="handleCreate">
      <div>
        <label for="title">Título</label>
        <input id="title" v-model="form.title" required />
      </div>
      <div>
        <label for="author">Autor</label>
        <input id="author" v-model="form.author" placeholder="Seu nome" />
      </div>
      <div>
        <label for="description">Descrição</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>
      <div class="actions">
        <button type="submit" class="button button-primary">Publicar Pergunta</button>
      </div>
      <p v-if="error" class="notice">{{ error }}</p>
    </form>
  </section>

  <section class="card">
    <h2>Perguntas recentes</h2>
    <div v-if="loading" class="notice">Carregando perguntas...</div>
    <div v-else-if="questions.length === 0" class="notice">
      Nenhuma pergunta cadastrada ainda. Seja o primeiro a perguntar!
    </div>
    <div v-else class="list">
      <article v-for="question in questions" :key="question.id" class="list-item">
        <div>
          <h3>{{ question.title }}</h3>
          <p class="meta">
            <span class="badge">Autor: {{ question.author }}</span>
            <span class="badge">{{ formatDate(question.created_at) }}</span>
          </p>
        </div>
        <div class="actions">
          <router-link class="button button-secondary" :to="`/questions/${question.id}`">
            Ver Respostas
          </router-link>
          <button class="button button-danger" type="button" @click="handleDelete(question.id)">
            Excluir
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { createQuestion, deleteQuestion, listQuestions, type Question } from "../services/api";

const questions = ref<Question[]>([]);
const loading = ref(true);
const error = ref("");

const form = reactive({
  title: "",
  description: "",
  author: "",
});

async function fetchQuestions() {
  loading.value = true;
  try {
    questions.value = await listQuestions();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

async function handleCreate() {
  error.value = "";
  try {
    await createQuestion({
      title: form.title.trim(),
      description: form.description.trim(),
      author: form.author.trim() || "Usuário",
    });
    form.title = "";
    form.description = "";
    form.author = "";
    await fetchQuestions();
  } catch (err) {
    error.value = (err as Error).message;
  }
}

async function handleDelete(id: number) {
  error.value = "";
  try {
    await deleteQuestion(id);
    questions.value = questions.value.filter((question) => question.id !== id);
  } catch (err) {
    error.value = (err as Error).message;
  }
}

onMounted(fetchQuestions);
</script>
