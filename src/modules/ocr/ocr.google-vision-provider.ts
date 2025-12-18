import { AppError } from '../../common/errors/app-error';
import { parseBase64Image } from '../../common/utils/base64';
import type { OcrGoogleVisionProvider, OcrGoogleVisionTextResultDto } from './ocr.types';

interface GoogleVisionAnnotateResponse {
  responses?: Array<{
    error?: {
      code?: number;
      message?: string;
      status?: string;
      details?: unknown;
    };
    fullTextAnnotation?: {
      text?: string;
    };
    textAnnotations?: Array<{
      description?: string;
    }>;
  }>;
}

const BASE_BACKOFF_MS = 200;
const MAX_BACKOFF_MS = 1000;

export class GoogleVisionOcrProvider implements OcrGoogleVisionProvider {
  async textDetection(params: Parameters<OcrGoogleVisionProvider['textDetection']>[0]): Promise<OcrGoogleVisionTextResultDto> {
    const { base64Payload } = parseBase64Image(params.imageBase64);

    if (!params.apiKey || params.apiKey.trim().length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'geminiApiKey is required');
    }

    const normalizedTimeout = Number.isFinite(params.aiRequestTimeoutMs) && params.aiRequestTimeoutMs > 0
      ? Math.floor(params.aiRequestTimeoutMs)
      : 0;

    const normalizedRetries = Number.isFinite(params.aiMaxRetries) && params.aiMaxRetries > 0
      ? Math.floor(params.aiMaxRetries)
      : 0;

    const operation = async (): Promise<OcrGoogleVisionTextResultDto> => {
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(params.apiKey)}`;

      const requestBody = {
        requests: [
          {
            image: { content: base64Payload },
            features: [{ type: 'TEXT_DETECTION' }],
          },
        ],
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let payload: GoogleVisionAnnotateResponse | undefined;
      try {
        payload = (await response.json()) as GoogleVisionAnnotateResponse;
      } catch (error) {
        const details = error instanceof Error ? { name: error.name, message: error.message } : { error };
        throw new AppError(502, 'AI_PROVIDER_ERROR', 'Google Vision returned non-JSON response', {
          httpStatus: response.status,
          details,
        });
      }

      if (!response.ok) {
        throw new AppError(502, 'AI_PROVIDER_ERROR', 'Google Vision request failed', {
          httpStatus: response.status,
          payload,
        });
      }

      const first = payload?.responses?.[0];
      const visionError = first?.error;
      if (visionError) {
        throw new AppError(502, 'AI_PROVIDER_ERROR', visionError.message ?? 'Google Vision error', {
          visionError,
        });
      }

      const fullText =
        first?.fullTextAnnotation?.text ??
        first?.textAnnotations?.[0]?.description ??
        '';

      return {
        provider: 'GOOGLE_CLOUD_VISION',
        fullText,
      };
    };

    try {
      return await runWithRetries(operation, normalizedRetries, normalizedTimeout);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const details =
        error instanceof Error
          ? { name: error.name, message: error.message }
          : { error };

      throw new AppError(500, 'AI_PROVIDER_ERROR', 'Google Vision textDetection request failed', details);
    }
  }
}

async function runWithRetries<T>(operation: () => Promise<T>, maxRetries: number, timeoutMs: number): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const result = await withTimeout(operation(), timeoutMs, `Google Vision request timed out after ${timeoutMs}ms`);
      return result;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        throw error;
      }

      const delayMs = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * (attempt + 1));
      await delay(delayMs);
    }
  }

  throw lastError ?? new Error('Unknown Google Vision error');
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  if (!timeoutMs) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
