import { useCallback, useRef } from "react";
import { Music } from "lucide-react";

interface MusicUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const MusicUpload: React.FC<MusicUploadProps> = ({ onChange, value }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadFileToCloudinary(file);
        }
    }, []);

    const uploadFileToCloudinary = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'z6euuqyl');

            const response = await fetch('https://api.cloudinary.com/v1_1/dv3z889zh/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onChange(data.secure_url);
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div
            className={`relative cursor-pointer hover:opacity-70 transition border-dashed border-2 ${value ? 'p-0 p-5' : 'p-10'} border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`}
            onClick={() => fileInputRef.current?.click()}
        >
            {!value && (
                <div className="flex flex-col gap-1 justify-center items-center">
                    <Music size={50} />
                    <div className="font-semibold text-lg">
                        Click to upload music
                    </div>
                </div>
            )}
            {value && (
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                        <audio controls>
                            <source src={value} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <div className="text-sm">
                            Uploaded music
                        </div>
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default MusicUpload;
