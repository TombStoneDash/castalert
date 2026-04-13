export type ProductionType = "Film" | "TV" | "Commercial" | "Theater" | "Voice" | "Music Video" | "New Media";
export type RoleType = "Lead" | "Supporting" | "Background" | "Voice" | "Stunt" | "Stand-In";
export type UnionStatus = "SAG-AFTRA" | "Non-Union" | "Both";

export interface CastingNotification {
  id: string;
  roleName: string;
  productionTitle: string;
  productionType: ProductionType;
  roleType: RoleType;
  unionStatus: UnionStatus;
  castingDirector?: string;
  deadline: string; // ISO date
  description?: string;
  read: boolean;
  saved: boolean;
  groupId?: string; // for smart grouping
  receivedAt: string; // ISO date
}

export interface NotificationPreferences {
  roleTypes: RoleType[];
  productionTypes: ProductionType[];
  unionStatus: UnionStatus[];
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
}

export interface NotificationGroup {
  key: string;
  label: string; // e.g., casting director name or production title
  notifications: CastingNotification[];
  collapsed: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  roleTypes: ["Lead", "Supporting", "Background", "Voice", "Stunt", "Stand-In"],
  productionTypes: ["Film", "TV", "Commercial", "Theater", "Voice", "Music Video", "New Media"],
  unionStatus: ["SAG-AFTRA", "Non-Union", "Both"],
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

export const PRODUCTION_ICONS: Record<ProductionType, string> = {
  Film: "film",
  TV: "tv",
  Commercial: "megaphone",
  Theater: "drama",
  Voice: "mic",
  "Music Video": "music",
  "New Media": "globe",
};
