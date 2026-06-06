<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useNoteStore } from './stores/noteStore';
import { useAuthStore } from './stores/authStore';
import { Search, Plus, SortAsc, Filter, StickyNote, Loader2, LogOut } from '@lucide/vue';
import NoteCard from './components/NoteCard.vue';
import NoteEditor from './components/NoteEditor.vue';
import AuthView from './components/AuthView.vue';

const noteStore = useNoteStore();
const authStore = useAuthStore();
const isCreating = ref(false);
const searchQuery = ref('');
const sortBy = ref('date');

onMounted(() => {
    if (authStore.isAuthenticated) {
        noteStore.fetchNotes();
    }
});

const handleLogout = () => {
    authStore.logout();
};

const handleSearch = () => {
    noteStore.setSearchQuery(searchQuery.value);
};

const handleSort = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    sortBy.value = value;
    noteStore.setSortBy(value);
};

const selectNote = async (id: number) => {
    isCreating.value = false;
    await noteStore.fetchNoteById(id);
};

const startNewNote = () => {
    noteStore.currentNote = null;
    isCreating.value = true;
};

const handleSave = async (data: { title: string; content?: string }) => {
    if (isCreating.value) {
        const newNote = await noteStore.createNote(data);
        isCreating.value = false;
        noteStore.currentNote = newNote;
    } else if (noteStore.currentNote) {
        await noteStore.updateNote(noteStore.currentNote.id, data);
        // After update, we might want to refresh the current note details
        await noteStore.fetchNoteById(noteStore.currentNote.id);
    }
};

const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
        await noteStore.deleteNote(id);
    }
};

const cancelEdit = () => {
    isCreating.value = false;
};
</script>

<template>
    <div v-if="authStore.isAuthenticated" class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="bg-blue-600 p-2 rounded-lg mr-3 shadow-md shadow-blue-200">
                        <StickyNote class="text-white" :size="24" />
                    </div>
                    <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        NotesApp
                    </h1>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="relative hidden sm:block">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Search :size="18" />
                        </span>
                        <input 
                            v-model="searchQuery"
                            @input="handleSearch"
                            type="text" 
                            placeholder="Search notes..." 
                            class="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                        >
                    </div>
                    
                    <button 
                        @click="startNewNote"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center transition-all shadow-md shadow-blue-100"
                    >
                        <Plus :size="18" class="mr-1.5" />
                        New Note
                    </button>

                    <button 
                        @click="handleLogout"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Log Out"
                    >
                        <LogOut :size="20" />
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div class="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)]">
                
                <!-- Sidebar: Notes List -->
                <div class="w-full lg:w-80 flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Notes</h2>
                        <div class="flex items-center text-xs text-gray-500">
                            <SortAsc :size="14" class="mr-1" />
                            <select @change="handleSort" class="bg-transparent border-none focus:ring-0 cursor-pointer font-medium p-0">
                                <option value="date">Newest</option>
                                <option value="title">A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div v-if="noteStore.loading && !noteStore.notes.length" class="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Loader2 class="animate-spin mb-2" :size="32" />
                            <p class="text-sm">Loading your notes...</p>
                        </div>
                        
                        <template v-else-if="noteStore.notes.length > 0">
                            <NoteCard 
                                v-for="note in noteStore.notes" 
                                :key="note.id" 
                                :note="note"
                                :isActive="noteStore.currentNote?.id === note.id"
                                @select="selectNote"
                                @delete="handleDelete"
                            />
                        </template>

                        <div v-else class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <div class="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <StickyNote class="text-gray-300" :size="24" />
                            </div>
                            <p class="text-gray-500 text-sm font-medium">No notes found</p>
                            <button @click="startNewNote" class="text-blue-600 text-xs mt-2 font-semibold hover:underline">
                                Create your first note
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Content: Editor -->
                <div class="flex-1 flex flex-col min-w-0">
                    <NoteEditor 
                        v-if="isCreating || noteStore.currentNote"
                        :note="noteStore.currentNote"
                        :isCreating="isCreating"
                        @save="handleSave"
                        @cancel="cancelEdit"
                    />
                    
                    <div v-else class="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm text-center p-12">
                        <div class="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                            <StickyNote class="text-blue-200" :size="40" />
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Select a note to view</h3>
                        <p class="text-gray-500 max-w-xs mx-auto">
                            Choose a note from the sidebar to read or edit its content, or create a new one to get started.
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Mobile Search (Visible only on small screens) -->
        <div class="sm:hidden fixed bottom-4 right-4 z-20">
             <!-- Mobile Floating Action Button could go here -->
        </div>
    </div>
    <AuthView v-else />
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
}
</style>
