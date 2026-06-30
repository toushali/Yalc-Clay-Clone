import type { MemberId, Timestamp, WorkspaceId } from "./common";

/** Member roles. Only `admin` is used in V1; gating arrives in V3 (S27). */
export type MemberRole = "admin" | "builder" | "viewer";

export interface WorkspaceMember {
  id: MemberId;
  name: string;
  email: string;
  role: MemberRole;
}

/** Top-level tenant container (FSD §3). */
export interface Workspace {
  id: WorkspaceId;
  name: string;
  members: WorkspaceMember[];
  creditBalance: number;
  createdAt: Timestamp;
}
