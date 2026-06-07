<script setup lang="ts">
import { useAuthStore } from './stores/authStore';
import AuthView from './views/AuthView.vue';
import NotesView from './views/NotesView.vue';

const authStore = useAuthStore();
</script>

<template>
    <NotesView v-if="authStore.isAuthenticated" />
    <AuthView v-else />
</template>
