/**
 * API contracts (minimal subset aligned with spec for this scaffold).
 * Adjust/extend exactly per the approved spec in future iterations.
 */

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  schemaVersion: string;
  time: string;
}

export interface AnalysisByHashRequest {
  pHash: string; // validated as hex string length 16-64 per spec; here we accept 16-64 hex
}

export interface AnalysisRecordDTO {
  analysisId: string;
  productId?: string | null;
  pHash: string;
  status: "queued" | "processing" | "succeeded" | "failed";
  summary?: string | null;
  etag?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  brand?: string | null;
  upc?: string | null;
  imageKey?: string | null;
}

export interface AnalysisByHashResponse {
  hit: boolean;
  record?: EnhancedAnalysisRecord;
  product?: ProductDTO | null;
  signedImageUrl?: string | null;
  jobId?: string;
  retryAfterSeconds?: number;
}

export interface AnalysisAnalyzeRequest {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  pHash?: string;
}

export interface AnalysisAnalyzeResponse {
  analysisId: string;
  status: "queued";
  jobId: string;
  retryAfterSeconds: number;
}

export interface AnalysisByProductIdResponse {
  hit: boolean;
  record?: EnhancedAnalysisRecord;
  etag?: string | null;
}

export interface SearchResponse {
  results: Array<{
    product: ProductDTO;
    score: number;
  }>;
}

export interface HistoryEvent {
  userId?: string;
  type: string;
  productId?: string;
  analysisId?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: string; // ISO
}

export interface HistoryRequest {
  events: HistoryEvent[];
}

export interface HistoryResponse {
  accepted: number;
}

export type ErrorResponse = {
  error: { code: string; message: string; details: Record<string, unknown> };
};

export interface IngredientAnalysis {
  name: string;
  rating: "good" | "neutral" | "bad";
  description: string;
  benefits: string[];
  concerns: string[];
}

export interface ProductAnalysisData {
  name: string;
  description: string;
  rating: number;
  ratingColor: string;
  ingredients: IngredientAnalysis[];
  concerns: string[];
}

export interface EnhancedAnalysisRecord extends AnalysisRecordDTO {
  analysisData?: ProductAnalysisData;
}