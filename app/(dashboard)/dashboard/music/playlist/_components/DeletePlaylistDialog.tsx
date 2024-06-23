"use client";

import React from "react";
import axios from "axios";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Props {
    trigger: React.ReactNode;
    category: Category;
}

export default function DeleteCategoryDialog({ trigger, category }: Props) {
    const deleteAlbum = async () => {
        try {
            const response = await axios.delete(`/api/category/${category.category_id}`);
            return response;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    };

    const handleDeleteClick = async () => {
        toast.loading("Removing category...");
        try {
            await deleteAlbum();
        } catch (error) {
            toast.error("Error when deleting category");
        } finally {
            toast.success('Album deleted successfully');
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
                        Are you sure you want to delete category data {category.category_name}?
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
