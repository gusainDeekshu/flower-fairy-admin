"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2, Save, Plus, Trash2, Layers } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import { adminProductService } from "@/services/admin-products.service";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; 
}

export const EditProductModal = ({ isOpen, onClose, product }: EditProductModalProps) => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);

  // Fetch Categories & Stores for dropdowns
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get("/categories");
      return res.data;
    },
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["admin-stores"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/stores");
      return res.data;
    },
  });

  // Setup Form with reactivity to 'product' prop
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    values: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      oldPrice: product?.oldPrice || "",
      categoryId: product?.categoryId || "",
      storeId: product?.storeId || "",
      ingredients: product?.ingredients || "",
      isActive: product?.isActive ?? true,
      // Mapping string arrays to objects for useFieldArray
      careInstructions: product?.careInstructions?.map((v: string) => ({ value: v })) || [{ value: "" }],
      deliveryInfo: product?.deliveryInfo?.map((v: string) => ({ value: v })) || [{ value: "" }],
      attributes: product?.attributes || [{ name: "", value: "" }],
      variants: product?.variants || [{ name: "", priceModifier: 0, stock: 10 }]
    }
  });

  // Sync Images
  useEffect(() => {
    if (product?.images) setImages(product.images);
  }, [product]);

  // Field Arrays
  const { fields: careFields, append: appendCare, remove: removeCare } = useFieldArray({ control, name: "careInstructions" as any });
  const { fields: deliveryFields, append: appendDelivery, remove: removeDelivery } = useFieldArray({ control, name: "deliveryInfo" as any });
  const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({ control, name: "attributes" as any });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" as any });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        images: images,
        careInstructions: formData.careInstructions.map((i: any) => i.value).filter(Boolean),
        deliveryInfo: formData.deliveryInfo.map((i: any) => i.value).filter(Boolean),
        attributes: formData.attributes.filter((a: any) => a.name && a.value),
        variants: formData.variants.filter((v: any) => v.name).map((v: any) => ({
          ...v,
          priceModifier: parseFloat(v.priceModifier || 0),
          stock: parseInt(v.stock || 0)
        })),
      };
      return adminProductService.updateProduct(product.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="p-8 border-b flex justify-between items-center bg-zinc-50">
          <div>
            <h2 className="text-2xl font-black text-zinc-800 tracking-tight uppercase">Update Product</h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">{product?.slug}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors"><X size={28} /></button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-8 space-y-10 overflow-y-auto">
          
          {/* STORE, CATEGORY & STATUS */}
          <div className="grid grid-cols-3 gap-6 bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Store</label>
              <select {...register("storeId")} className="w-full p-3 border rounded-2xl bg-white outline-none focus:ring-2 focus:ring-[#006044] font-bold">
                {stores.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</label>
              <select {...register("categoryId")} className="w-full p-3 border rounded-2xl bg-white outline-none focus:ring-2 focus:ring-[#006044] font-bold">
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 bg-white p-4 rounded-2xl border cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="w-5 h-5 accent-[#006044]" />
              <span className="text-xs font-black text-zinc-600 uppercase">Active</span>
            </label>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-6">
            <input {...register("name", { required: true })} placeholder="Product Name *" className="col-span-2 w-full p-4 border rounded-2xl font-black text-lg outline-none" />
            <input {...register("price", { required: true })} type="number" placeholder="Price *" className="w-full p-4 border rounded-2xl font-black" />
            <input {...register("oldPrice")} type="number" placeholder="MRP" className="w-full p-4 border rounded-2xl" />
            <input {...register("ingredients")} placeholder="Ingredients Highlights" className="col-span-2 w-full p-4 border rounded-2xl" />
          </div>

          {/* VARIANTS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={18} className="text-[#006044]" /> Product Variants
              </label>
              <button type="button" onClick={() => appendVariant({ name: "", priceModifier: 0, stock: 10 })} className="text-[10px] font-black bg-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-200">+ ADD VARIANT</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {variantFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4 bg-zinc-50 p-4 rounded-3xl border border-zinc-100">
                  <input {...register(`variants.${index}.name` as any)} placeholder="Name" className="p-3 border rounded-xl text-sm font-bold" />
                  <input {...register(`variants.${index}.priceModifier` as any)} type="number" placeholder="Price +/-" className="p-3 border rounded-xl text-sm font-bold" />
                  <input {...register(`variants.${index}.stock` as any)} type="number" placeholder="Stock" className="p-3 border rounded-xl text-sm" />
                  <button type="button" onClick={() => removeVariant(index)} className="text-zinc-300 hover:text-rose-500 justify-self-center"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Specifications</label>
              <button type="button" onClick={() => appendAttr({ name: "", value: "" })} className="text-[10px] font-black bg-zinc-100 px-4 py-2 rounded-full">+ ADD SPEC</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {attrFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center bg-zinc-50 p-3 rounded-2xl border">
                  <input {...register(`attributes.${index}.name` as any)} className="w-1/2 bg-transparent text-sm font-black uppercase tracking-tighter outline-none" />
                  <input {...register(`attributes.${index}.value` as any)} className="w-1/2 bg-transparent text-sm font-bold border-l pl-3 outline-none" />
                  <button type="button" onClick={() => removeAttr(index)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY */}
          <div className="space-y-4">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Images</label>
            <div className="flex gap-4 flex-wrap">
              {images.map((url, i) => (
                <div key={i} className="relative h-28 w-28 rounded-3xl overflow-hidden border shadow-sm group">
                  <img src={url} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md"><X size={14}/></button>
                </div>
              ))}
              <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result: any) => setImages([...images, result.info.secure_url])}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="h-28 w-28 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-[#006044] bg-zinc-50">
                    <Upload size={24} />
                    <span className="text-[10px] font-black mt-2 tracking-widest">ADD</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* CARE & DELIVERY */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between">Care Instructions <Plus size={14} className="cursor-pointer text-green-600" onClick={() => appendCare({ value: "" })}/></label>
              {careFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input {...register(`careInstructions.${index}.value` as any)} className="flex-1 p-3 border rounded-xl text-sm font-bold" />
                  <button type="button" onClick={() => removeCare(index)} className="text-zinc-300"><X size={16}/></button>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between">Delivery Info <Plus size={14} className="cursor-pointer text-blue-600" onClick={() => appendDelivery({ value: "" })}/></label>
              {deliveryFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input {...register(`deliveryInfo.${index}.value` as any)} className="flex-1 p-3 border rounded-xl text-sm font-bold" />
                  <button type="button" onClick={() => removeDelivery(index)} className="text-zinc-300"><X size={16}/></button>
                </div>
              ))}
            </div>
          </div>

          <textarea {...register("description")} placeholder="Description" rows={5} className="w-full p-5 border rounded-3xl outline-none text-zinc-600 font-medium" />

          <button disabled={mutation.isPending} className="w-full bg-[#006044] text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-green-100 hover:bg-[#004d36] transition-all flex items-center justify-center gap-4">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <><Save size={24}/> UPDATE PRODUCT DATA</>}
          </button>
        </form>
      </div>
    </div>
  );
};