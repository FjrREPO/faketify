"use client";

import React from "react";
import axios from "axios";
import { Playlist } from "@prisma/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Props {
    trigger: React.ReactNode;
    playlist: Playlist;
}

export default function DeletePlaylistDialog({ trigger, playlist }: Props) {
    const deletePlaylist = async () => {
        try {
            const response = await axios.delete(`/api/music/playlist/${playlist.playlist_id}`);
            return response;
        } catch (error) {
            console.error("Error deleting playlist:", error);
            throw error;
        }
    };

    const handleDeleteClick = async () => {
        toast.loading("Removing playlist...");
        try {
            await deletePlaylist();
        } catch (error) {
            toast.error("Error when deleting playlist");
        } finally {
            toast.success('Playlist deleted successfully');
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
                        Are you sure you want to delete playlist data {playlist.playlist_name}?
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
