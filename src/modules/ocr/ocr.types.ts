import { BaseGeminiRequestDto } from '../../common/types/gemini';

export type DocumentSide = 'FRONT' | 'BACK';

export interface OcrIdCardRequestDto extends BaseGeminiRequestDto {
  imageBase64: string;
  documentSide: DocumentSide;
}

export interface OcrDriverLicenseRequestDto extends BaseGeminiRequestDto {
  imageBase64: string;
  documentSide: DocumentSide;
}

// Google Vision OCR doesn't need Gemini fields like model/prompt, but we keep
// geminiApiKey in the body for consistency with existing APIs.
export interface OcrGoogleVisionTextRequestDto {
  geminiApiKey: string;
  requestId?: string;
  aiRequestTimeoutMs: number;
  aiMaxRetries: number;
  imageBase64: string;
}

export interface OcrIdCardResultDto {
  documentType: 'ID_CARD';
  fullName: string;
  dateOfBirth: string;
  documentNumber: string;
  expiryDate: string;
  issuingCountry: string;
  confidenceScore: number;
  isValidate: boolean;
  reasonText: string;
}

export interface OcrDriverLicenseResultDto {
  documentType: 'DRIVER_LICENSE';
  fullName: string;
  dateOfBirth: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  category: string;
  confidenceScore: number;
  isValidate: boolean;
  reasonText: string;
}

export interface OcrGoogleVisionTextResultDto {
  provider: 'GOOGLE_CLOUD_VISION';
  fullText: string;
}

export interface OcrProvider {
  ocrIdCard(params: {
    imageBase64: string;
    apiKey: string;
    prompt: string;
    model: string;
    aiRequestTimeoutMs: number;
    aiMaxRetries: number;
  }): Promise<OcrIdCardResultDto>;
  ocrDriverLicense(params: {
    imageBase64: string;
    apiKey: string;
    prompt: string;
    model: string;
    aiRequestTimeoutMs: number;
    aiMaxRetries: number;
  }): Promise<OcrDriverLicenseResultDto>;
}

export interface OcrGoogleVisionProvider {
  textDetection(params: {
    imageBase64: string;
    apiKey: string;
    aiRequestTimeoutMs: number;
    aiMaxRetries: number;
  }): Promise<OcrGoogleVisionTextResultDto>;
}

export interface OcrService {
  processIdCardOcr(request: OcrIdCardRequestDto): Promise<OcrIdCardResultDto>;
  processDriverLicenseOcr(request: OcrDriverLicenseRequestDto): Promise<OcrDriverLicenseResultDto>;
  processGoogleVisionTextOcr(request: OcrGoogleVisionTextRequestDto): Promise<OcrGoogleVisionTextResultDto>;
}
