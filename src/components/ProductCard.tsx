import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/products-static";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      aria-label={product.title}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#EDE8E1] aspect-[3/4] mb-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#B5903A] text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium">
              Featured
            </span>
          </div>
        )}
        {product.outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-[#6B6560] font-medium">
              Sold Out
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {/* Quick view on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1C1C1C] text-white text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs tracking-widest uppercase font-medium">
          View Details
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-1">
        <p className="text-[10px] tracking-widest uppercase text-[#B5903A] font-medium font-[family-name:var(--font-body)]">
          {product.subtitle}
        </p>
        <h3 className="text-base font-[family-name:var(--font-heading)] font-medium text-[#1C1C1C] leading-snug group-hover:text-[#B5903A] transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm font-[family-name:var(--font-body)] text-[#4A4440] font-medium mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
