import { getBrandBySlug } from "@/lib/brand";
import { getProductsByBrand } from "@/lib/product";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BrandPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch brand by slug
  try {
    const brand = await getBrandBySlug(params.slug);
    const products = await getProductsByBrand(brand.$id);

    // Filter active products
    const activeProducts = products.filter(product => product.isActive);

    return (
      <div className="min-h-screen bg-background">
        {/* Brand Banner */}
        <div className="relative h-60 w-full bg-muted md:h-80">
          {brand.bannerUrl ? (
            <img
              src={brand.bannerUrl}
              alt={`${brand.name} banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900">
              <span className="text-4xl font-bold text-muted-foreground">
                {brand.name}
              </span>
            </div>
          )}
        </div>

        <div className="container py-8">
          {/* Brand Header */}
          <div className="mb-12 flex flex-col items-center md:flex-row md:items-start md:gap-6">
            {/* Brand Logo */}
            <div className="relative -mt-16 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-md md:h-40 md:w-40">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-4xl font-bold text-primary-foreground">
                  {brand.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="mt-4 text-center md:mt-0 md:text-left">
              <h1 className="text-3xl font-bold md:text-4xl">{brand.name}</h1>
              {brand.description && (
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {brand.description}
                </p>
              )}
            </div>
          </div>

          {/* Products Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="mt-1 h-1 w-20 bg-primary"></div>
          </div>

          {/* Products Grid */}
          {activeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
              <h3 className="text-xl font-semibold">No products available</h3>
              <p className="mt-2 text-muted-foreground">
                This brand hasn&apos;t added any products yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {activeProducts.map((product) => (
                <Link
                  href={`/brand/${brand.slug}/product/${product.slug}`}
                  key={product.$id}
                  className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    
                    {/* Price */}
                    <div className="mt-2 flex items-center gap-2">
                      {product.discountPrice ? (
                        <>
                          <span className="font-semibold">
                            ₹{product.discountPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching brand:", error);
    notFound();
  }
}