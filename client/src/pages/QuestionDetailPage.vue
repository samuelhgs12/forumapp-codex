<template>
  <section class="card">
    <router-link class="link" to="/">← Voltar para perguntas</router-link>
    <div v-if="loading" class="notice">Carregando pergunta...</div>
    <div v-else-if="question">
      <h2>{{ question.title }}</h2>
      <p class="meta">
        <span class="badge">Autor: {{ question.author }}</span>
        <span class="badge">{{ formatDate(question.created_at) }}</span>
      </p>
      <p>{{ question.description }}</p>
    </div>
  </section>

  <section class="card">
    <h3>Responder pergunta</h3>
    <form class="form-grid" @submit.prevent="handleAnswer">
      <div>
        <label for="answer-author">Autor</label>
        <input id="answer-author" v-model="answerForm.author" placeholder="Seu nome" />
      </div>
      <div>
        <label for="answer-content">Resposta</label>
        <textarea id="answer-content" v-model="answerForm.content" required></textarea>
      </div>
      <div class="actions">
        <button type="submit" class="button button-primary">Enviar resposta</button>
      </div>
      <p v-if="error" class="notice">{{ error }}</p>
    </form>
  </section>

  <section class="card">
    <h3>Respostas</h3>
    <div v-if="answersLoading" class="notice">Carregando respostas...</div>
    <div v-else-if="answers.length === 0" class="notice">Nenhuma resposta ainda.</div>
    <div v-else class="list">
      <article v-for="answer in answers" :key="answer.id" class="list-item">
        <div>
          <p>{{ answer.content }}</p>
          <p class="meta">
            <span class="badge">Autor: {{ answer.author }}</span>
            <span class="badge">{{ formatDate(answer.created_at) }}</span>
          </p>
        </div>
        <div class="actions">
          <button class="button button-danger" type="button" @click="handleDeleteAnswer(answer.id)">
            Excluir
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import {
  createAnswer,
  deleteAnswer,
  getQuestion,
  listAnswers,
  type Answer,
  type Question,
} from "../services/api";

const route = useRoute();
const questionId = Number(route.params.id);

const question = ref<Question | null>(null);
const answers = ref<Answer[]>([]);
const loading = ref(true);
const answersLoading = ref(true);
const error = ref("");

const answerForm = reactive({
  author: "",
  content: "",
});

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

async function fetchQuestion() {
  loading.value = true;
  try {
    question.value = await getQuestion(questionId);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

async function fetchAnswers() {
  answersLoading.value = true;
  try {
    answers.value = await listAnswers(questionId);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    answersLoading.value = false;
  }
}

async function handleAnswer() {
  error.value = "";
  try {
    await createAnswer(questionId, {
      author: answerForm.author.trim() || "Usuário",
      content: answerForm.content.trim(),
    });
    answerForm.author = "";
    answerForm.content = "";
    await fetchAnswers();
  } catch (err) {
    error.value = (err as Error).message;
  }
}

async function handleDeleteAnswer(id: number) {
  error.value = "";
  try {
    await deleteAnswer(id);
    answers.value = answers.value.filter((answer) => answer.id !== id);
  } catch (err) {
    error.value = (err as Error).message;
  }
}

onMounted(async () => {
  await fetchQuestion();
  await fetchAnswers();
});
</script>
