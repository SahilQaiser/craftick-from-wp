"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  featured?: boolean;
}

export default function ProductImageGallery({ images, title, featured }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8E1]">
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#B5903A] text-white text-[10px] tracking-widest uppercase px-3 py-1.5 font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails — only shown when there are multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-20 shrink-0 overflow-hidden bg-[#EDE8E1] border-2 transition-colors ${
                i === active
                  ? "border-[#B5903A]"
                  : "border-transparent hover:border-[#E8E3DC]"
              }`}
            >
              <Image
                src={src}
                alt={`${title} view ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
