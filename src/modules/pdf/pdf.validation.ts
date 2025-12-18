import { z } from 'zod';

const EKYC_ID_RE = /^[A-Za-z0-9_-]{1,128}$/;
const COLOR_RE = /^#?[0-9a-fA-F]{6}$/;

const pdfBase64Schema = z.string().min(1).refine((s) => {
  try { return Buffer.from(s, 'base64').length <= 20 * 1024 * 1024; } catch { return false; }
}, { message: 'pdfBase64 must be valid base64 and <= 20MB' });

const appearanceSchema = z.object({
  color: z.string().regex(COLOR_RE).optional(),
  fontSize: z.number().optional(),
}).optional();

const signerSchema = z.object({
  ekycId: z.string().regex(EKYC_ID_RE),
  page: z.number().int().min(1).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  // anchorPhrase: if provided, server will locate this phrase and place the signature
  // 1cm below the phrase. When anchorPhrase is present, explicit x/y coordinates are ignored.
  anchorPhrase: z.string().optional(),
  // paddingLeft: offset from anchor phrase x-coordinate or explicit x-coordinate (default: 0)
  paddingLeft: z.number().optional(),
  // paddingTop: offset from anchor phrase y-coordinate or explicit y-coordinate (default: 0)
  paddingTop: z.number().optional(),
  // whether to draw a visible border for this signer (if omitted, border is drawn
  // only when x/y/width/height are explicitly provided)
  drawBorder: z.boolean().optional(),
  reason: z.string().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
  contactInfo: z.string().optional(),
  // showDate: if false, timestamp will not be rendered in the signature box (default: true)
  showDate: z.boolean().optional(),
  appearance: appearanceSchema,
});

export const signPdfSchema = z.object({
  ekycId: z.string().regex(EKYC_ID_RE),
  pdfBase64: z.string().min(1).refine((s) => {
    try {
      const b = Buffer.from(s, 'base64');
      return b.length <= 20 * 1024 * 1024; // 20MB
    } catch (e) {
      return false;
    }
  }, { message: 'pdfBase64 must be valid base64 and <= 20MB' }),
  reason: z.string().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
  contactInfo: z.string().optional(),
  requestId: z.string().optional(),
});

 
export const verifyPdfSchema = z.object({
  pdfBase64: pdfBase64Schema,
  details: z.boolean().optional(),
  requestId: z.string().optional(),
});

export const findAnchorSchema = z.object({
  pdfBase64: pdfBase64Schema,
  anchorPhrase: z.string().min(1),
  page: z.number().int().min(1).optional(),
  requestId: z.string().optional(),
});

const signVisibleMultiSchema = z.object({
  pdfBase64: pdfBase64Schema,
  // signers: array of objects describing each visible signer and optional positioning
  signers: z.array(signerSchema).min(1),
  requestId: z.string().optional(),
}).transform((v) => ({ pdfBase64: v.pdfBase64, signers: v.signers, requestId: v.requestId }));

// Backward-compat: accept legacy single-signer shape used by older clients/tests
// and normalize to the new multi-signer contract.
const legacyRectSchema = z.object({
  page: z.number().int().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const signVisibleLegacySchema = z.object({
  pdfBase64: pdfBase64Schema,
  ekycId: z.string().regex(EKYC_ID_RE),
  // legacy placement fields (still accepted):
  placementMode: z.string().optional(),
  rect: legacyRectSchema.optional(),
  page: z.number().int().min(1).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  anchorPhrase: z.string().optional(),
  paddingLeft: z.number().optional(),
  paddingTop: z.number().optional(),
  drawBorder: z.boolean().optional(),
  name: z.string().optional(),
  reason: z.string().optional(),
  location: z.string().optional(),
  contactInfo: z.string().optional(),
  showDate: z.boolean().optional(),
  appearance: appearanceSchema,
  requestId: z.string().optional(),
}).transform((v) => {
  const rect = v.rect;
  const normalizedSigner = {
    ekycId: v.ekycId,
    page: rect?.page ?? v.page,
    x: rect?.x ?? v.x,
    y: rect?.y ?? v.y,
    width: rect?.width ?? v.width,
    height: rect?.height ?? v.height,
    anchorPhrase: v.anchorPhrase,
    paddingLeft: v.paddingLeft,
    paddingTop: v.paddingTop,
    drawBorder: v.drawBorder,
    name: v.name,
    reason: v.reason,
    location: v.location,
    contactInfo: v.contactInfo,
    showDate: v.showDate,
    appearance: v.appearance,
  };

  return {
    pdfBase64: v.pdfBase64,
    signers: [normalizedSigner],
    requestId: v.requestId,
  };
});

export const signVisibleSchema = z.union([signVisibleMultiSchema, signVisibleLegacySchema]);
