import { z } from "zod";

// Basic HTML/XSS sanitizer helper
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, "") // Strip raw HTML tags
    .replace(/javascript:/gi, "") // Remove javascript pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers like onclick=
    .trim();
}

export const ReportCategoryEnum = z.enum([
  "Waterlogging",
  "Damaged Roads",
  "Garbage Overflow",
  "Broken Streetlights",
  "Disrupted Services",
]);

export const PriorityLevelEnum = z.enum(["Critical", "High", "Medium", "Low"]);

export const ReportStatusEnum = z.enum([
  "Submitted",
  "In Review",
  "Dispatched",
  "Resolved",
]);

export const GeoLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(300)
    .transform(sanitizeText),
  street: z
    .string()
    .min(1, "Street is required")
    .max(150)
    .transform(sanitizeText),
  landmark: z.string().max(200).optional().transform((val) => (val ? sanitizeText(val) : "")),
  zone: z.string().max(100).optional().transform((val) => (val ? sanitizeText(val) : "Central")),
});

export const CreateReportSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(120, "Title cannot exceed 120 characters")
    .transform(sanitizeText),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .transform(sanitizeText),
  category: ReportCategoryEnum,
  location: GeoLocationSchema,
  imageUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val.startsWith("data:image/") ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      { message: "Image must be a valid base64 data URI, local path, or URL" }
    )
    .optional(),
  citizenContact: z
    .object({
      name: z.string().max(100).optional().transform((val) => (val ? sanitizeText(val) : "")),
      email: z.string().email("Invalid email").optional().or(z.literal("")),
      phone: z
        .string()
        .max(20)
        .optional()
        .transform((val) => (val ? sanitizeText(val) : "")),
    })
    .optional(),
});

export const UpdateReportStatusSchema = z.object({
  status: ReportStatusEnum,
  assignedDepartment: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  assignedCrew: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  estimatedResolutionTime: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  note: z
    .string()
    .min(3, "Update note must be at least 3 characters")
    .max(500)
    .transform(sanitizeText),
  actor: z.string().max(80).default("Municipal Dispatcher").transform(sanitizeText),
});

export const UpvoteReportSchema = z.object({
  voterToken: z.string().min(1).max(100).default("anonymous"),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof UpdateReportStatusSchema>;
