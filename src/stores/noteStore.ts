import { defineStore } from 'pinia';
import apiClient from '../api/client';
import type { Note, NoteListDto, NoteDetailDto, NoteCreateDto, NoteUpdateDto } from '../types/note';

export const useNoteStore = defineStore('notes', {
    state: () => ({
        notes: [] as NoteListDto[],
        filteredNotes: [] as NoteListDto[],
        currentNote: null as NoteDetailDto | null,
        loading: false,
        error: null as string | null,
        searchQuery: '',
        sortBy: 'date',
    }),
    actions: {
        async fetchNotes() {
            this.loading = true;
            try {
                const response = await apiClient.get<NoteListDto[]>(`/notes`);
                this.notes = response.data;
                this.filteredNotes = response.data;
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch notes';
            } finally {
                this.loading = false;
            }
        },
        async fetchNoteById(id: number) {
            this.loading = true;
            try {
                const response = await apiClient.get<NoteDetailDto>(`/notes/${id}`);
                this.currentNote = response.data;
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch note';
            } finally {
                this.loading = false;
            }
        },
        async createNote(dto: NoteCreateDto) {
            this.loading = true;
            try {
                const response = await apiClient.post<NoteDetailDto>('/notes', dto);
                this.notes.unshift({
                    id: response.data.id,
                    title: response.data.title,
                    createdAt: response.data.createdAt
                });
                return response.data;
            } catch (err: any) {
                this.error = err.message || 'Failed to create note';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async updateNote(id: number, dto: NoteUpdateDto) {
            this.loading = true;
            try {
                await apiClient.put(`/notes/${id}`, dto);
                await this.fetchNotes(); // Refresh list to get updated titles/sorting
            } catch (err: any) {
                this.error = err.message || 'Failed to update note';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async deleteNote(id: number) {
            this.loading = true;
            try {
                await apiClient.delete(`/notes/${id}`);
                this.notes = this.notes.filter(n => n.id !== id);
                if (this.currentNote?.id === id) {
                    this.currentNote = null;
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to delete note';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        setSearchQuery(query: string) {
            this.searchQuery = query;
            this.fetchNotes();
        },
        setSortBy(sort: string) {
            this.sortBy = sort;
            this.fetchNotes();
        }
    }
});
