import { z } from 'zod';

export const ProjectLinkSchema = z.object({
    label: z.string(),
    url: z.string().url().or(z.literal('')).default(''),
    icon: z.string().default(''),
});

export const TeamSchema = z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string().default(''),
    linkedIn: z.string().url().or(z.literal('')).default(''),
});

export const ProjectMetadataSchema = z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    images: z.array(z.string()).default([]),
    tag: z.string().optional(),
    team: z.array(TeamSchema).default([]),
    link: z.string().url().optional(),
    links: z.array(ProjectLinkSchema).default([]),
});

export type ProjectMetadataParsed = z.infer<typeof ProjectMetadataSchema>;
