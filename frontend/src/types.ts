export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface HomeAssistant {
  language: string;
  config?: { time_zone?: string };
  user: HassUser;
  states: Record<string, HassEntity>;
  areas?: Record<string, { area_id: string; name: string; floor_id?: string | null }>;
  floors?: Record<string, { floor_id: string; name: string }>;
  devices?: Record<string, { id: string; name: string | null; name_by_user: string | null; area_id: string | null }>;
  entities?: Record<string, { entity_id: string; device_id?: string | null; area_id?: string | null; hidden?: boolean; entity_category?: string | null; platform?: string; translation_key?: string }>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  connection: {
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
  };
}

export interface Situation {
  id: string;
  title: string;
  description: string;
  phase: string;
  kind: string;
  category: string;
  severity: number;
  opened_at: string | null;
  first_seen: string;
  acked_by: string | null;
  handled_by: string | null;
  snoozed_until: string | null;
  assessment: Record<string, any>;
  repair: Record<string, any>;
  entities: string[];
  history: { ts: string; event: string; [k: string]: unknown }[];
}

export interface Approval {
  id: string;
  what: string;
  risk: number;
  reason: string;
  approver: string;
  created: string;
  expires: string | null; // requests that are not actions (a fact, a habit) wait until someone decides
  status: string;
  decided_by: string | null;
  kind?: "fact" | "habit";
}

export interface WorldSummary {
  floors: { id: string; name: string }[];
  areas: { id: string; name: string; floor_id: string | null }[];
  persons: { id: string; name: string; role: string; home: boolean }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  ts?: string;
}
