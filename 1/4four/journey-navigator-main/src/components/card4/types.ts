import type { Difficulty } from "@/lib/route-coords";

export interface DayInfo {
  id: string;
  from: string;
  to: string;
  km: number;
  hours: number;
  difficulty: Difficulty;
  roadType: string;
  highlight: string;
}

export interface RoutePlan {
  days: DayInfo[];
}
