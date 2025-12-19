<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="error-message">{{ error.message }}</div>
  <div v-else-if="question" class="question-detail-view">
    <h1>{{ question.title }}</h1>
    <p class="question-meta">Asked on {{ new Date(question.createdAt).toLocaleString() }}</p>

    <hr />

    <h3>Answers</h3>
    <div v-if="question.answers.length" class="answers-list">
      <div v-for="answer in question.answers" :key="answer.id" class="answer-item">
        <p>{{ answer.content }}</p>
        <span class="answer-meta">Answered on {{ new Date(answer.createdAt).toLocaleString() }}</span>
      </div>
    </div>
    <div v-else>
      <p>No answers yet. Be the first to respond!</p>
    </div>

    <hr />

    <form @submit.prevent="submitAnswer" class="new-answer-form">
      <h3>Your Answer</h3>
      <textarea v-model="newAnswerContent" placeholder="Type your answer here..." required></textarea>
      <button type="submit">Post Answer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

interface Answer {
  id: number;
  content: string;
  questionId: number;
  createdAt: string;
}

interface Question {
  id: number;
  title: string;
  createdAt: string;
  answers: Answer[];
}

const route = useRoute();
const question = ref<Question | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const newAnswerContent = ref('');

const questionId = route.params.id as string;

const fetchQuestionDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/questions/${questionId}`);
    question.value = response.data;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err;
    } else {
      error.value = new Error('An unknown error occurred while fetching the question.');
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submitAnswer = async () => {
  if (!newAnswerContent.value.trim()) return;
  try {
    await api.post(`/questions/${questionId}/answers`, {
      content: newAnswerContent.value.trim(),
    });
    newAnswerContent.value = '';
    await fetchQuestionDetails(); // Refresh details to show new answer
  } catch (err) {
    alert('Failed to post answer. Please try again.');
    console.error(err);
  }
};

onMounted(fetchQuestionDetails);
</script>

<style scoped>
.question-detail-view {
  padding: 20px 0;
}
.question-meta, .answer-meta {
  font-size: 0.8em;
  color: #666;
  margin-bottom: 20px;
}
.answers-list {
  margin-top: 20px;
}
.answer-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}
.new-answer-form {
  margin-top: 30px;
}
.new-answer-form textarea {
  width: 100%;
  min-height: 100px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}
.new-answer-form button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.new-answer-form button:hover {
  background-color: #218838;
}
.error-message {
  color: red;
}
</style>
