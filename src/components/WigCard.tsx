import Image from "next/image";
import Link from "next/link";
import type { Wig } from "@/lib/wigs";

export default function WigCard({ wig }: { wig: Wig }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={wig.imageUrl}
          alt={wig.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg">{wig.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">{wig.color}</span>
          <span className="text-sm text-gray-300">·</span>
          <span className="text-sm text-gray-500">{wig.style}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {wig.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            ${wig.price.toFixed(2)}
          </span>
          <Link
            href={`/try-on/${wig.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            Try On
          </Link>
        </div>
      </div>
    </div>
  );
}
