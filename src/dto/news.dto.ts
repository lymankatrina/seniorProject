import type { ContentStatus } from '../types/contentStatuses';

export interface CreateNewsInput {
  title: string;
  tagline: string;
  description: string;
  date: string;
  image: string;
  link: string;
  status: ContentStatus;
  isActive: boolean;
}

export type UpdateNewsInput =
  Partial<CreateNewsInput>;