<template>
  <form @submit.prevent="submitQuestion" class="new-question-form">
    <input
      type="text"
      v-model="newQuestionTitle"
      placeholder="Ask a new question..."
      required
    />
    <button type="submit">Add Question</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const newQuestionTitle = ref('');
const emit = defineEmits(['questionAdded']);

const submitQuestion = () => {
  if (newQuestionTitle.value.trim()) {
    emit('questionAdded', newQuestionTitle.value.trim());
    newQuestionTitle.value = ''; // Clear input after submission
  }
};
</script>

<style scoped>
.new-question-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.new-question-form input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.new-question-form button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.new-question-form button:hover {
  background-color: #0056b3;
}
</style>
