import { ColorCssResult, FrontendHabit } from "@/lib/models/habit";

export interface HasHabit {
  habit: FrontendHabit;
}

export interface HasColors {
  colors: Record<keyof ColorCssResult, string>;
}
