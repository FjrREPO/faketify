import { z } from "zod";

export const albumSchema = z.object({
    album_id: z.string(),
    album_name: z.string(),
    album_release_date: z.coerce.date(),
    album_popularity: z.coerce.number().optional(),
    album_images: z.array(z.string()),
    album_tracks_id: z.array(z.string()),
    album_artists_id: z.array(z.string()),
});

export type CreateAlbumSchemaType = z.infer<typeof albumSchema>;