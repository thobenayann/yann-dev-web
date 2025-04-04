export type Team = {
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
};

export type ProjectLink = {
    label: string;
    url: string;
    icon: string;
};

export type ProjectMetadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    team: Team[];
    link?: string;
    links?: ProjectLink[];
};

export type Project = {
    metadata: ProjectMetadata;
    slug: string;
    content: string;
};
