import type { Listed, TagRecord } from "@/types";
import { api } from "./client";

export const tagsApi = {
  list: () => api.get<Listed<TagRecord>>("/tags"),
};
