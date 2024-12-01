'use client'

import { ImageUp } from "lucide-react"
import { CldUploadWidget, CldUploadWidgetProps } from "next-cloudinary"
import Image from "next/image"
import { useCallback } from "react"

interface ImageUploadProps {
    onChange: (value: string[]) => void
    value: string[]
}

declare global {
    var cloudinary: {
        createUploadWidget: (options: CldUploadWidgetProps, callback: (error: Error | null, result: CldUploadWidgetProps) => void) => void
    }
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const handleUpload = useCallback((result: any) => {
        if (result.info && typeof result.info.secure_url === 'string') {
            onChange([...value, result.info.secure_url]);
        }
    }, [onChange, value]);

    return <CldUploadWidget
        onSuccess={handleUpload}
        uploadPreset='z6euuqyl'
    >
        {({ open }) => {
            return (
                <div onClick={() => open && open()}
                    className={`relative cursor-pointer hover:opacity-70 transition border-dashed border-2 ${value && value.length > 0 ? 'p-5' : 'p-10'} border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`}
                >
                    {value && value.length <= 0 && (
                        <div>
                            <ImageUp size={50} />
                            <div className="font-semibold text-lg">
                                Click to upload
                            </div>
                        </div>
                    )}
                    {value && value.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-5 w-fit h-full">
                            {value.map((imageUrl, index) => (
                                <Image
                                    key={index}
                                    alt={`Uploaded image ${index + 1}`}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'contain' }}
                                    src={imageUrl}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )
        }}
    </CldUploadWidget>
}

export default ImageUpload