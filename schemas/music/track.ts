import { z } from "zod";

export const trackSchema = z.object({
    track_id: z.string(),
    track_name: z.string(),
    track_duration_ms: z.coerce.number().positive().multipleOf(0.01),
    track_popularity: z.coerce.number().optional(),
    track_file: z.string().optional(),
    track_albums_id: z.array(z.string()).optional(),
    track_artists_id: z.array(z.string()).optional(),
});

export type CreateTrackSchemaType = z.infer<typeof trackSchema>;