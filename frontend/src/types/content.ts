// Knowledge base article (serializeKbArticle).
export interface KbArticle {
  id: string;
  title: string;
  body: string;
  category: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

// Canned reply macro (serializeCannedResponse).
export interface CannedResponse {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
}

// A tag from the shared vocabulary with usage count (serializeTagRecord).
export interface TagRecord {
  id: string;
  name: string;
  color: string;
  count: number;
}
