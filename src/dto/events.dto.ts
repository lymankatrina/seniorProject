import type { ContentStatus } from '../types/contentStatuses';
import type { EventType } from '../types/eventTypes';

export interface CreateEventInput {
  title: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  image: string;
  link: string;
  type: EventType;
  postStartDate: string;
  postEndDate: string;
  status: ContentStatus;
}

export type UpdateEventInput =
  Partial<CreateEventInput>;

  