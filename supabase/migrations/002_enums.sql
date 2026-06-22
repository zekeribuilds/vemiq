-- Vemiq Database V1 - Enums
-- Migration: 002_enums.sql

create type user_role as enum (
    'student',
    'admin'
);

create type program_type as enum (
    'SWEP',
    'SIWES'
);

create type report_status as enum (
    'draft',
    'completed'
);

create type payment_status as enum (
    'pending',
    'successful',
    'failed'
);

create type logbook_status as enum (
    'active',
    'completed'
);

create type source_type as enum (
    'text',
    'voice',
    'image',
    'mixed'
);

create type file_type as enum (
    'image',
    'audio',
    'pdf',
    'document'
);

create type chat_role as enum (
    'user',
    'assistant'
);
