// src/types/index.ts

export type LoginUser = {
    id: number;
    agency_id: number | null;
    email: string;
    created_at: string;
    updated_at: string;
    company_name: string;
    agency_name: string; // ここを修正
};

export type Agency = {
    id: number;
    agency_name: string;
    agency_code: string;
    created_at: string;
    updated_at: string;
};

export type Client = {
    id: number;
    client_name: string;
    agency_id: number;
    created_at: string;
    updated_at: string;
};

export type Release = {
    id: number;
    release_name: string;
    client_id: number;
    created_at: string;
    updated_at: string;
}