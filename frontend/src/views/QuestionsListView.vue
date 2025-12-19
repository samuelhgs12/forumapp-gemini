<template>
  <div class="questions-list-view">
    <h2>All Questions</h2>

    <NewQuestionForm @questionAdded="handleAddQuestion" />

    <div v-if="loading">Loading questions...</div>
    <div v-else-if="error" class="error-message">Error: {{ error.message }}</div>
    <ul v-else-if="questions.length">
      <li v-for="question in questions" :key="question.id">
        <div class="question-info">
          <router-link :to="`/question/${question.id}`">{{ question.title }}</router-link>
          <span class="created-at">({{ new Date(question.createdAt).toLocaleString() }})</span>
        </div>
        <button @click="handleDeleteQuestion(question.id)" class="delete-btn">Delete</button>
      </li>
    </ul>
    <div v-else>No questions yet. Be the first to ask!</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import NewQuestionForm from '@/components/NewQuestionForm.vue';

interface Question {
  id: number;
  title: string;
  createdAt: string;
}

const questions = ref<Question[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

const fetchQuestions = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get('/questions');
    questions.value = response.data;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err;
    } else {
      error.value = new Error('An unknown error occurred.');
    }
  } finally {
    loading.value = false;
  }
};

const handleAddQuestion = async (title: string) => {
  try {
    await api.post('/questions', { title });
    await fetchQuestions(); // Refresh the list after adding
  } catch (err) {
    if (err instanceof Error) {
      error.value = err;
    } else {
      error.value = new Error('Failed to add question.');
    }
  }
};

const handleDeleteQuestion = async (id: number) => {
  if (confirm('Are you sure you want to delete this question and all its answers?')) {
    try {
      await api.delete(`/questions/${id}`);
      await fetchQuestions(); // Refresh the list
    } catch (err) {
      alert('Failed to delete question.');
      console.error(err);
    }
  }
};

onMounted(fetchQuestions);
</script>

<style scoped>
.questions-list-view {
  padding: 20px 0;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-info {
  display: flex;
  flex-direction: column;
}

li a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  margin-bottom: 5px;
}

li a:hover {
  text-decoration: underline;
}

.created-at {
  font-size: 0.8em;
  color: #666;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.delete-btn {
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>