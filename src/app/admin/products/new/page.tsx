import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Add Product — Admin" };

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Add Product</h1>
        <p className="text-sm text-[#6B6560] mt-1">Add a new product to your catalogue</p>
      </div>
      <div className="bg-white border border-[#E8E3DC] p-8">
        <ProductForm />
      </div>
    </div>
  );
}
