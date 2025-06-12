// components/RecipeForm.tsx
// Modal form component for adding and editing recipes
// Handles form validation and submission

'use client';

import { useState, useEffect } from 'react';
import { Recipe, RecipeFormData } from '@/lib/types';

interface RecipeFormProps {
  recipe?: Recipe;                          // Optional recipe for editing (undefined = add mode)
  suggestedData?: RecipeFormData | null;    // Optional suggested recipe data to pre-fill form
  isOpen: boolean;                          // Modal visibility state
  onClose: () => void;                      // Callback to close modal
  onSubmit: (formData: RecipeFormData) => Promise<void>;  // Callback for form submission
}

export default function RecipeForm({ recipe, suggestedData, isOpen, onClose, onSubmit }: RecipeFormProps) {
  // Form state
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    ingredients: '',
    instructions: '',
    cuisineType: '',
    preparationTime: 30,
    servings: 4,
    difficulty: 'Easy',
    tags: ''
  });

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common cuisine types for dropdown
  const cuisineTypes = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 
    'French', 'Thai', 'Mediterranean', 'American', 'Other'
  ];

  // Initialize form data when recipe prop changes (edit mode) or suggestedData changes
  useEffect(() => {
    if (recipe) {
      // Convert recipe back to form format
      setFormData({
        name: recipe.name,
        ingredients: recipe.ingredients.join(', '),
        instructions: recipe.instructions.join('\n'),
        cuisineType: recipe.metadata.cuisineType,
        preparationTime: recipe.metadata.preparationTime,
        servings: recipe.metadata.servings,
        difficulty: recipe.metadata.difficulty,
        tags: recipe.metadata.tags.join(', ')
      });
    } else if (suggestedData) {
      // Use suggested recipe data
      setFormData(suggestedData);
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        ingredients: '',
        instructions: '',
        cuisineType: '',
        preparationTime: 30,
        servings: 4,
        difficulty: 'Easy',
        tags: ''
      });
    }
    setErrors({});
  }, [recipe, suggestedData]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!formData.cuisineType.trim()) {
      newErrors.cuisineType = 'Cuisine type is required';
    }

    if (formData.preparationTime < 1 || formData.preparationTime > 500) {
      newErrors.preparationTime = 'Preparation time must be between 1 and 500 minutes';
    }

    if (formData.servings < 1 || formData.servings > 20) {
      newErrors.servings = 'Servings must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to save recipe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof RecipeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setErrors({});
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {recipe ? 'Edit Recipe' : suggestedData ? 'Review AI Suggested Recipe' : 'Add New Recipe'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Recipe Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Spaghetti Carbonara"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients * (comma-separated)
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                errors.ingredients ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 400g spaghetti, 200g pancetta, 4 eggs, 100g parmesan"
            />
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions * (one step per line)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                errors.instructions ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Cook spaghetti in salted water until al dente&#10;Fry pancetta until crispy&#10;Beat eggs with parmesan and pepper"
            />
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Cuisine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type *
              </label>
              <select
                value={formData.cuisineType}
                onChange={(e) => handleChange('cuisineType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.cuisineType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select cuisine...</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              {errors.cuisineType && <p className="text-red-500 text-sm mt-1">{errors.cuisineType}</p>}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Numbers Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Preparation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Time (minutes) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.preparationTime}
                onChange={(e) => handleChange('preparationTime', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.preparationTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preparationTime && <p className="text-red-500 text-sm mt-1">{errors.preparationTime}</p>}
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.servings}
                onChange={(e) => handleChange('servings', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${
                  errors.servings ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated, optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="e.g., vegetarian, quick, comfort-food"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (recipe ? 'Update Recipe' : suggestedData ? 'Save AI Recipe' : 'Add Recipe')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}