"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/uploader/image-upload';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { Category } from '@prisma/client';

interface Props {
    category: Category;
    trigger: React.ReactNode;
}

export default function EditCategoryDialog({ category, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    
    const [categoryName, setCategoryName] = useState(category.category_name);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {

        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data
            };
            await axios.post(`/api/category/${category.category_id}`, formattedData);
            toast.success('Album created successfully!');
            reset();
            setOpen(false);
            window.location.reload()
        } catch (error) {
            toast.error('Failed to create album.');
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-full'>
                            <Label>Category Name</Label>
                            <Input {...register('category_name')} value={categoryName} placeholder='Category Name' onChange={(e) => {
                                setCategoryName(e.target.value);
                            }} />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit(onSubmit)} disabled={pending}>
                        {pending && <Loader className="shrink-0 h-4 w-4 mr-2 animate-spin" />}
                        {pending ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
