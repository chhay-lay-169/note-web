<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { StickyNote, Mail, Lock, User, Loader2, AlertCircle } from '@lucide/vue';

const authStore = useAuthStore();
const isLogin = ref(true);

const form = reactive({
    email: '',
    password: '',
    name: '' // Included in UI but not strictly used by current backend Login/Register DTOs
});

const toggleMode = () => {
    isLogin.value = !isLogin.value;
    authStore.error = null;
};

const handleSubmit = async () => {
    if (isLogin.value) {
        await authStore.login({
            email: form.email,
            password: form.password
        });
    } else {
        const success = await authStore.register({
            email: form.email,
            password: form.password
        });
        if (success) {
            // After successful registration, switch to login
            isLogin.value = true;
            authStore.error = null;
        }
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div class="flex flex-col items-center mb-8">
                <div class="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200 mb-4">
                    <StickyNote class="text-white" :size="32" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isLogin ? 'Welcome back' : 'Create an account' }}
                </h2>
                <p class="text-gray-500 mt-2">
                    {{ isLogin ? 'Enter your details to sign in' : 'Join us to start taking notes' }}
                </p>
            </div>

            <!-- Error Message -->
            <div v-if="authStore.error" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start text-red-600 text-sm">
                <AlertCircle class="mr-2 shrink-0" :size="18" />
                <span>{{ authStore.error }}</span>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
                <div v-if="!isLogin" class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <User :size="18" />
                        </span>
                        <input 
                            v-model="form.name"
                            type="text" 
                            placeholder="John Doe" 
                            class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                    </div>
                </div>

                <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Mail :size="18" />
                        </span>
                        <input 
                            v-model="form.email"
                            type="email" 
                            required
                            placeholder="you@example.com" 
                            class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                    </div>
                </div>

                <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Lock :size="18" />
                        </span>
                        <input 
                            v-model="form.password"
                            type="password" 
                            required
                            placeholder="••••••••" 
                            class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                    </div>
                </div>

                <button 
                    type="submit"
                    :disabled="authStore.loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center"
                >
                    <Loader2 v-if="authStore.loading" class="animate-spin mr-2" :size="20" />
                    {{ isLogin ? 'Sign in' : 'Register' }}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-gray-500">
                {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
                <button 
                    @click="toggleMode"
                    class="text-blue-600 font-semibold hover:underline ml-1"
                >
                    {{ isLogin ? 'Register' : 'Sign in' }}
                </button>
            </div>
        </div>
    </div>
</template>
