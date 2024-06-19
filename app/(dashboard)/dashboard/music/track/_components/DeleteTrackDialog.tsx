"use client";

import React from "react";
import axios from "axios";
import { Track } from "@prisma/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Props {
    trigger: React.ReactNode;
    track: Track;
}

export default function DeleteTrackDialog({ trigger, track }: Props) {
    const deleteTrack = async () => {
        try {
            const response = await axios.delete(`/api/music/track/${track.track_id}`);
            return response;
        } catch (error) {
            console.error("Error deleting track:", error);
            throw error;
        }
    };

    const handleDeleteClick = async () => {
        toast.loading("Removing track...");
        try {
            await deleteTrack();
        } catch (error) {
            toast.error("Error when deleting track");
        } finally {
            toast.success('Track deleted successfully');
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
                        Are you sure you want to delete track data {track.track_name}?
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
