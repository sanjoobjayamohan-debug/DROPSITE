import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Images,
  Upload,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

const FASHION_CATEGORIES: ProductCategory[] = ['Men', 'Women', 'Children'];

const COMMON_FABRICS = [
  '100% Pure Cotton',
  'Chanderi Silk',
  'Mulmul Cotton',
  'Linen Blend',
  'Banarasi Jacquard',
  'Georgette',
  'Raw Denim',
  'Khadi Cotton',
  'Organic Cotton',
];

const DEFAULT_5_IMAGES = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
];

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleStockStatus } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Women');
  const [material, setMaterial] = useState('Chanderi Silk');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(3499);
  const [originalMrp, setOriginalMrp] = useState(4999);
  const [supplierCost, setSupplierCost] = useState(1200);
  const [shippingCost, setShippingCost] = useState(0);
  const [supplierSku, setSupplierSku] = useState('CHN-SLK-009');
  const [supplierName, setSupplierName] = useState('Chanderi Master Weavers Guild');
  const [supplierOrigin, setSupplierOrigin] = useState('Chanderi, Madhya Pradesh');
  const [stock, setStock] = useState(45);
  const [leadTimeDays, setLeadTimeDays] = useState(2);
  const [sizes, setSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL']);

  // 5 Nos Images State (Explicit User Requirement: upload 5 images)
  const [images5, setImages5] = useState<string[]>([
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  ]);

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          const updated = [...images5];
          updated[index] = result;
          setImages5(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...images5];
    updated[index] = val;
    setImages5(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Filter non-empty images or fallback to default
    const validImages = images5.filter((img) => img.trim().length > 0);
    const primaryImg = validImages[0] || DEFAULT_5_IMAGES[0];

    addProduct({
      name: name.trim(),
      category,
      material,
      tagline: tagline.trim() || 'Handwoven natural textile tailored in limited atelier batches.',
      description: description.trim() || 'Woven on traditional pit looms with azo-free dyes and hand-finished hems.',
      price: Number(price),
      originalMrp: Number(originalMrp),
      supplierCost: Number(supplierCost),
      shippingCost: Number(shippingCost),
      supplierSku: supplierSku.trim(),
      supplierName: supplierName.trim(),
      supplierOrigin: supplierOrigin.trim(),
      leadTimeDays: Number(leadTimeDays),
      stock: Number(stock),
      safetyStockThreshold: 10,
      inStock: stock > 0,
      autoSyncSupplier: true,
      image: primaryImg,
      images: validImages.length > 0 ? validImages : DEFAULT_5_IMAGES,
      galleryImages: validImages.length > 0 ? validImages : DEFAULT_5_IMAGES,
      sizes,
      specs: [
        { label: 'Department', value: `${category}'s Collection` },
        { label: 'Material', value: material },
        { label: 'Weave Origin', value: supplierOrigin },
        { label: 'Care', value: 'Gentle hand wash / Shade dry' },
      ],
      rating: 4.9,
      reviewCount: 1,
    });

    setIsAddModalOpen(false);
    // Reset form
    setName('');
    setTagline('');
    setDescription('');
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      material: editingProduct.material,
      price: Number(editingProduct.price),
      originalMrp: Number(editingProduct.originalMrp),
      supplierCost: Number(editingProduct.supplierCost),
      stock: Number(editingProduct.stock),
      supplierSku: editingProduct.supplierSku,
      supplierName: editingProduct.supplierName,
      inStock: editingProduct.stock > 0,
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-2xl font-medium text-stone-900">
            Garment Catalog & Multi-Angle Photos
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Manage handloom garments across Men, Women, and Children collections with 5-image gallery slots.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-medium rounded-full shadow-xs flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Garment (5 Photos)</span>
        </button>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF9F6] border-b border-stone-200 text-stone-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Garment</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  {/* Garment Details & Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-14 object-cover rounded-md bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="font-medium text-stone-900 line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                          SKU: {p.supplierSku} · {p.galleryImages?.length || 5} photos
                        </div>
                        <div className="text-[10px] text-stone-500 font-light">{p.supplierOrigin}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[11px] text-stone-800 bg-stone-100 px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </td>

                  {/* Material */}
                  <td className="py-3.5 px-4 font-light text-stone-700">
                    {p.material || 'Natural Handloom'}
                  </td>

                  {/* Retail Price */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-medium text-stone-900">{formatINR(p.price)}</div>
                    {p.originalMrp && (
                      <div className="text-[10px] text-stone-400 line-through">
                        MRP: {formatINR(p.originalMrp)}
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleStockStatus(p.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        p.inStock
                          ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.inStock ? `${p.stock} in stock` : 'Out of Stock'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete garment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD APPAREL PRODUCT MODAL WITH 5 IMAGES UPLOAD (User Requirement) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-editorial text-2xl font-medium text-stone-900">
                Add Garment with 5 Image Perspectives
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="pt-6 space-y-6 text-xs">
              
              {/* Category, Title, Material */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Department
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                  >
                    {FASHION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}'s Collection
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Garment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Handwoven Chanderi Kurta Set"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Material & Sourcing Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Clothing Material / Fabric
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                  >
                    {COMMON_FABRICS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Atelier / Weave Origin
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierOrigin}
                    onChange={(e) => setSupplierOrigin(e.target.value)}
                    placeholder="e.g. Chanderi, Madhya Pradesh"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-medium text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Hand-spun organic cotton with unbleached kora finish"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-800"
                />
              </div>

              {/* 5 NOS PRODUCT IMAGES UPLOAD SECTION (EXPLICIT USER REQUEST) */}
              <div className="p-5 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-stone-900 flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-stone-700" />
                    <span>Upload 5 Garment Photos</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-light">
                    5 Photos (Front, Back, Weave, Styling, Detail)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { label: '1. Front View', index: 0 },
                    { label: '2. Back Angle', index: 1 },
                    { label: '3. Fabric Weave', index: 2 },
                    { label: '4. Silhouette Fit', index: 3 },
                    { label: '5. Hem & Stitch', index: 4 },
                  ].map((slot) => (
                    <div key={slot.index} className="bg-white p-2.5 rounded-lg border border-stone-200 flex flex-col justify-between gap-2">
                      <div className="aspect-[3/4] rounded-md overflow-hidden bg-stone-100 relative border border-stone-200">
                        <img
                          src={images5[slot.index]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                          #{slot.index + 1}
                        </span>
                      </div>

                      <div className="text-[10px] font-medium text-stone-700 truncate">
                        {slot.label}
                      </div>

                      {/* File upload input */}
                      <label className="w-full py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-medium rounded cursor-pointer flex items-center justify-center gap-1 transition-colors">
                        <Upload className="w-3 h-3 text-stone-600" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(slot.index, e)}
                        />
                      </label>

                      {/* URL input */}
                      <input
                        type="url"
                        value={images5[slot.index]}
                        onChange={(e) => handleImageUrlChange(slot.index, e.target.value)}
                        placeholder="Or image URL"
                        className="w-full p-1 bg-stone-50 border border-stone-200 rounded text-[9px] font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">M.R.P. (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={originalMrp}
                    onChange={(e) => setOriginalMrp(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Retail Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono font-medium text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Inventory Units</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full shadow-xs cursor-pointer"
                >
                  Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-editorial text-xl font-medium text-stone-900">
                Edit {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Garment Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Inventory Units</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white font-medium rounded-full cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
