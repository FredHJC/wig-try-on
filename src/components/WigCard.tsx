import Image from "next/image";
import Link from "next/link";
import type { Wig } from "@/lib/wigs";

export default function WigCard({ wig }: { wig: Wig }) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <Link href={`/try-on/${wig.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={wig.imageUrl}
          alt={wig.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Try-On badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-pink-600 px-2.5 py-1 rounded-full shadow-sm">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Try On
          </span>
        </div>
      </Link>

      {/* Product info */}
      <div className="p-3 sm:p-4">
        {/* Color + Style tags */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {wig.color}
          </span>
          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {wig.style}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {wig.name}
        </h3>

        {/* Price + Actions */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${wig.price.toFixed(2)}
            </span>
            <p className="text-[11px] text-gray-400 mt-0.5">+ Free shipping</p>
          </div>
          <Link
            href={`/try-on/${wig.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-700 transition-colors"
          >
            Virtual Try-On
          </Link>
        </div>
      </div>
    </div>
  );
}
