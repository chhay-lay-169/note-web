<script setup lang="ts">
import { Search, Plus, SortAsc, Clock, Trash2 } from '@lucide/vue';
import type { NoteListDto } from '../types/note';

defineProps<{
    note: NoteListDto;
    isActive: boolean;
}>();

defineEmits<{
    (e: 'select', id: number): void;
    (e: 'delete', id: number): void;
}>();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
</script>

<template>
    <div 
        @click="$emit('select', note.id)"
        class="p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-200"
        :class="[
            isActive 
                ? 'bg-blue-50 border-blue-200 shadow-sm' 
                : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'
        ]"
    >
        <div class="flex justify-between items-start">
            <h3 class="font-medium text-gray-900 truncate flex-1">{{ note.title }}</h3>
            <button 
                @click.stop="$emit('delete', note.id)"
                class="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
            >
                <Trash2 :size="16" />
            </button>
        </div>
        <div class="flex items-center mt-2 text-xs text-gray-500">
            <Clock :size="12" class="mr-1" />
            {{ formatDate(note.createdAt) }}
        </div>
    </div>
</template>
