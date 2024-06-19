"use client";

import React from "react";
import axios from "axios";
import { Artist } from "@prisma/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Props {
    trigger: React.ReactNode;
    artist: Artist;
}

export default function DeleteArtistDialog({ trigger, artist }: Props) {
    const deleteArtist = async () => {
        try {
            const response = await axios.delete(`/api/music/artist/${artist.artist_id}`);
            return response;
        } catch (error) {
            console.error("Error deleting artist:", error);
            throw error;
        }
    };

    const handleDeleteClick = async () => {
        toast.loading("Removing artist...");
        try {
            await deleteArtist();
        } catch (error) {
            toast.error("Error when deleting artist");
        } finally {
            toast.success('Artist deleted successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete artist data {artist.artist_name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Data that has been deleted cannot be restored. Make sure the data to be deleted is correct.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClick}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
