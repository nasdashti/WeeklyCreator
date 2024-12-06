import React from 'react';
import { useChannelStore } from '../store/channelStore';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onChange,
  disabled = false,
}) => {
  const { categories } = useChannelStore();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Content Categories
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {categories.map((category: string) => (
          <label
            key={category}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm
              ${
                selectedCategories.includes(category)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-50'}
            `}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={selectedCategories.includes(category)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedCategories, category]);
                } else {
                  onChange(selectedCategories.filter((c) => c !== category));
                }
              }}
              disabled={disabled}
            />
            {category}
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Select categories that best describe your content
      </p>
    </div>
  );
};