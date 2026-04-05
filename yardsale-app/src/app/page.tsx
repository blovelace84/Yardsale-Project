import { db } from "@/lib/db";

export default async function Home() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Browse Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <p className="font-semibold">${item.price}</p>
                <p className="text-sm truncate">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
