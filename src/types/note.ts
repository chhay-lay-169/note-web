export interface Note {
    id: number;
    title: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoteListDto {
    id: number;
    title: string;
    createdAt: string;
}

export interface NoteDetailDto {
    id: number;
    title: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoteCreateDto {
    title: string;
    content?: string;
}

export interface NoteUpdateDto {
    title: string;
    content?: string;
}
