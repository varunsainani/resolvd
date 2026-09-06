// Barrel for the API client: core request helpers, token store, and every
// resource module.
export { ApiError, api, request, toQuery } from "./client";
export { getToken, setToken, clearToken } from "./token";
export { authApi, type AuthResult, type ProfileUpdate } from "./auth";
export { ticketsApi } from "./tickets";
export type {
  TicketListParams,
  TicketCreateBody,
  TicketPatchBody,
  ReplyBody,
} from "./tickets";
export { customersApi, type CustomerListParams } from "./customers";
export { kbApi, type KbListParams, type KbBody } from "./kb";
export { cannedApi, type CannedListParams, type CannedBody } from "./canned";
export { tagsApi } from "./tags";
export { analyticsApi } from "./analytics";
export { agentsApi } from "./agents";
export { adminApi, type InviteBody } from "./admin";
export { publicApi, type PublicSubmitBody } from "./public";
