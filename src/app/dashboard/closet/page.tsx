"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaTshirt,
  FaShoePrints,
  FaHatCowboy,
  FaSocks,
  FaHeart,
  FaFilter,
  FaTimes,
  FaCamera,
  FaUpload,
  FaWindowClose,
} from "react-icons/fa";

// Types
type ClothingCategory =
  | "All"
  | "Tops"
  | "Bottoms"
  | "Shoes"
  | "Accessories"
  | "Outerwear";
type ClothingTag =
  | "Casual"
  | "Formal"
  | "Party"
  | "Office"
  | "Summer"
  | "Winter";

interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  tags: ClothingTag[];
  imageUrl: string;
  favorite: boolean;
  lastWorn?: Date;
}

// Mock data
const mockClothingItems: ClothingItem[] = [
  {
    id: "1",
    name: "Blue Oxford Shirt",
    category: "Tops",
    tags: ["Casual", "Office"],
    imageUrl: "/mock/shirt1.jpg",
    favorite: true,
  },
  {
    id: "2",
    name: "Black Jeans",
    category: "Bottoms",
    tags: ["Casual"],
    imageUrl: "/mock/pants1.jpg",
    favorite: false,
  },
  {
    id: "3",
    name: "Running Shoes",
    category: "Shoes",
    tags: ["Casual", "Summer"],
    imageUrl: "/mock/shoes1.jpg",
    favorite: true,
  },
  {
    id: "4",
    name: "Silver Necklace",
    category: "Accessories",
    tags: ["Party", "Formal"],
    imageUrl: "/mock/acc1.jpg",
    favorite: false,
  },
  {
    id: "5",
    name: "Winter Jacket",
    category: "Outerwear",
    tags: ["Winter", "Casual"],
    imageUrl: "/mock/jacket1.jpg",
    favorite: true,
  },
];

const AddItemModal = ({
  onClose,
  onAddItem,
  categories,
}: {
  onClose: () => void;
  onAddItem: (item: Omit<ClothingItem, "id">) => void;
  categories: { label: ClothingCategory; icon: React.ReactNode }[];
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [selectedTags, setSelectedTags] = useState<ClothingTag[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  const availableTags: ClothingTag[] = [
    "Casual",
    "Formal",
    "Party",
    "Office",
    "Summer",
    "Winter",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category) {
      onAddItem({
        name,
        category,
        tags: selectedTags,
        imageUrl: imagePreview || "/mock/placeholder.jpg",
        favorite,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            {imagePreview ? (
              <div className="relative w-full max-w-xs">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <FaWindowClose className="text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  <FaCamera className="text-gray-600" />
                  <span>Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  <FaUpload className="text-gray-600" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="e.g., Blue Oxford Shirt"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {categories
                .filter((cat) => cat.label !== "All")
                .map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="mr-2 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor="favorite"
              className="text-sm font-medium text-gray-700"
            >
              Mark as favorite
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transition-colors font-medium"
          >
            Add Item
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default function ClosetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clothingItems, setClothingItems] =
    useState<ClothingItem[]>(mockClothingItems);

  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    { label: "All", icon: <FaTshirt /> },
    { label: "Tops", icon: <FaTshirt /> },
    { label: "Bottoms", icon: <FaSocks /> },
    { label: "Shoes", icon: <FaShoePrints /> },
    { label: "Accessories", icon: <FaHatCowboy /> },
  ];

  const handleAddItem = (newItem: Omit<ClothingItem, "id">) => {
    const item: ClothingItem = {
      ...newItem,
      id: `${clothingItems.length + 1}`,
    };
    setClothingItems([...clothingItems, item]);
  };

  const filteredItems = clothingItems.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="h-full bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block border-b bg-white">
        <div className="max-w-[100rem] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Smart Closet</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white 
                       rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaPlus />
              <span>Add New Item</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center 
                     text-white shadow-lg hover:bg-green-600 transition-colors"
        >
          <FaPlus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-[100rem] mx-auto px-4">
        {/* Search and Filters */}
        <div className="my-6">
          <div className="flex space-x-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your closet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.label}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedCategory(category.label)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg 
                       transition-colors ${
                         selectedCategory === category.label
                           ? "bg-green-500 text-white"
                           : "bg-white text-gray-600 hover:bg-gray-50"
                       }`}
            >
              {category.icon}
              <span className="whitespace-nowrap">{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Clothing Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gray-200" />
                {item.favorite && (
                  <div className="absolute top-2 right-2 text-red-500">
                    <FaHeart className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate">
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add New Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemModal
            onClose={() => setIsAddModalOpen(false)}
            onAddItem={handleAddItem}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
