import WigCard from "@/components/WigCard";
import { getAllWigs } from "@/lib/wigs";

export default function Home() {
  const wigs = getAllWigs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Find Your Perfect Wig
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Browse our collection and try any wig on virtually using AI. See
          exactly how it looks on you before you buy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wigs.map((wig) => (
          <WigCard key={wig.id} wig={wig} />
        ))}
      </div>
    </div>
  );
}
