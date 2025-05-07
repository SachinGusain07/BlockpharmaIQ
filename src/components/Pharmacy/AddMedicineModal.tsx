import React from 'react';
import { useForm } from 'react-hook-form';

export interface InventoryItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  stock: number;
  threshold: number;
  unit: string;
  price: number;
  expiry: string;
}

export interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'image'> & { image: File }) => void;
}

const CATEGORIES = [
  'Pain Relief', 'Antibiotics', 'Vitamins', 'Cardiovascular', 'Respiratory',
  'Gastrointestinal', 'Dermatological', 'Allergy', 'Other'
];

const UNITS = [
  'tablets', 'capsules', 'ml', 'mg', 'g', 'strips', 'bottles', 'vials', 'ampules', 'patches'
];

const AddMedicineModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Omit<InventoryItem, 'id' | 'image'> & { image: File }>();

  const submitHandler = (data: any) => {
    const formattedData = {
      ...data,
      stock: Number(data.stock),
      threshold: Number(data.threshold),
      price: Number(data.price),
      image: data.image[0],
    };
    console.log('Adding medicine to inventory:', formattedData); // ✅ Console the filled data
    onSubmit(formattedData);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-100/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Medicine to Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Name + Brand in one row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Medicine Name*</label>
              <input
                type="text"
                {...register('name', { required: 'Medicine name is required' })}
                className="w-full p-2 border rounded"
                placeholder="Enter medicine name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Brand*</label>
              <input
                type="text"
                {...register('brand', { required: 'Brand is required' })}
                className="w-full p-2 border rounded"
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Image*</label>
            <input
              type="file"
              accept="image/*"
              {...register('image', { required: 'Image is required' })}
              className="w-full"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantity*</label>
            <input
              type="number"
              {...register('stock', { required: 'Quantity is required', min: 1 })}
              className="w-full p-2 border rounded"
              placeholder="Enter stock quantity"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>

          {/* Threshold */}
          <div>
            <label className="block text-sm font-medium mb-1">Reorder Threshold*</label>
            <input
              type="number"
              {...register('threshold', { required: 'Threshold is required', min: 0 })}
              className="w-full p-2 border rounded"
              placeholder="Enter threshold level"
            />
            {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold.message}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit*</label>
            <select
              {...register('unit', { required: 'Unit is required' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select unit</option>
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)*</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="w-full p-2 border rounded"
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date*</label>
            <input
              type="date"
              {...register('expiry', { required: 'Expiry date is required' })}
              className="w-full p-2 border rounded"
            />
            {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
