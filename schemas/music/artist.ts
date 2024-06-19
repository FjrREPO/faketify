import { z } from "zod";

export const artistSchema = z.object({
    artist_id: z.string(),
    artist_name: z.string(),
    artist_popularity: z.coerce.number().optional(),
    artist_followers: z.coerce.number().optional(),
    artist_images: z.array(z.string()).optional(),
    artist_genres: z.array(z.string()).optional(),
});

export type CreateArtistSchemaType = z.infer<typeof artistSchema>;

export interface ArtistInterface {
    artist_id: string;
    artist_name: string;
    artist_popularity?: number;
    artist_followers?: number;
    artist_images?: string[];
    artist_genres?: string[];
}