import { FrontendHabit } from "@/lib/models/habit";

export interface HasHabit {
  habit: FrontendHabit;
}

export interface HasColors {
  colors: Record<'background' | 'muted' | 'hover' | 'text', string>;
}
