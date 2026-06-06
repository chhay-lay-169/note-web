<script setup lang="ts">
import { ref, watch } from 'vue';
import { Save, X } from '@lucide/vue';
import type { NoteDetailDto } from '../types/note';

const props = defineProps<{
    note: NoteDetailDto | null;
    isCreating: boolean;
}>();

const emit = defineEmits<{
    (e: 'save', data: { title: string; content?: string }): void;
    (e: 'cancel'): void;
}>();

const title = ref('');
const content = ref('');

watch(() => props.note, (newNote) => {
    if (newNote) {
        title.value = newNote.title;
        content.value = newNote.content || '';
    } else {
        title.value = '';
        content.value = '';
    }
}, { immediate: true });

const handleSave = () => {
    if (!title.value.trim()) return;
    emit('save', { title: title.value, content: content.value });
};
</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 class="text-lg font-semibold text-gray-800">
                {{ isCreating ? 'New Note' : 'Edit Note' }}
            </h2>
            <div class="flex space-x-2">
                <button 
                    @click="$emit('cancel')"
                    class="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                    <X :size="16" class="mr-1" /> Cancel
                </button>
                <button 
                    @click="handleSave"
                    :disabled="!title.trim()"
                    class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm flex items-center"
                >
                    <Save :size="16" class="mr-1" /> Save
                </button>
            </div>
        </div>
        
        <div class="p-6 flex-1 flex flex-col space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                <input 
                    v-model="title"
                    type="text"
                    placeholder="Enter note title..."
                    class="w-full text-2xl font-bold text-gray-900 border-none focus:ring-0 placeholder-gray-300 p-0"
                    autofocus
                />
            </div>
            
            <div class="flex-1 flex flex-col">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Content</label>
                <textarea 
                    v-model="content"
                    placeholder="Start writing..."
                    class="w-full flex-1 text-gray-700 border-none focus:ring-0 resize-none placeholder-gray-300 p-0"
                ></textarea>
            </div>
        </div>

        <div v-if="note && !isCreating" class="px-6 py-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between">
            <span>Created: {{ new Date(note.createdAt).toLocaleString() }}</span>
            <span>Last Updated: {{ new Date(note.updatedAt).toLocaleString() }}</span>
        </div>
    </div>
</template>
