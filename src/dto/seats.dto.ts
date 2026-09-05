import type { SectionType } from '../types/section';

export interface CreateSeatInput {
  seat: number;
  row: string;
  section: SectionType;
}

export type UpdateSeatInput =
  Partial<CreateSeatInput>;
  