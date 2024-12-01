import { motion } from "framer-motion";

export function CardArtistsHome({ label, image, id }: { label: string; image: string, id: string }) {
    return (
        <motion.a
            className="flex flex-col pt-2 min-w-[200px] h-auto justify-between duration-200 cursor-pointer"
            transition={{
                ease: "linear",
                duration: 2,
                x: { duration: 1 }
            }}
            href={`/artist/${id}`}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <motion.img
                        src={image || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
                        className="rounded-full w-[180px] h-[180px]"
                        alt="image"
                        whileHover={{ scale: 1.05 }}
                    />
                </div>
                <span className="max-w-[200px] line-clamp-2">{label || ''}</span>
            </div>
        </motion.a>
    );
}