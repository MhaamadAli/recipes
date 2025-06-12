// components/RecipeCard.tsx
// Card component for displaying recipe information
// Includes status management and action buttons

'use client';

import { Recipe, RecipeStatus } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;                           // Recipe data to display
  onEdit: (recipe: Recipe) => void;         // Callback to edit recipe
  onDelete: (id: string) => void;           // Callback to delete recipe
  onStatusChange: (id: string, status: RecipeStatus) => void;  // Callback to change status
}

export default function RecipeCard({ recipe, onEdit, onDelete, onStatusChange }: RecipeCardProps) {
  
  // Status badge styling based on current status
  const getStatusBadge = (status: RecipeStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'favorite':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'to-try':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'made':
        return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  // Difficulty badge styling
  const getDifficultyBadge = (difficulty: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    
    switch (difficulty) {
      case 'Easy':
        return `${baseClasses} bg-green-200 text-green-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-200 text-yellow-800`;
      case 'Hard':
        return `${baseClasses} bg-red-200 text-red-800`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle status change from dropdown
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as RecipeStatus;
    onStatusChange(recipe.id, newStatus);
  };

  // Confirm delete action
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      onDelete(recipe.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
            {recipe.name}
          </h3>
          
          {/* Status Badge */}
          <span className={getStatusBadge(recipe.status)}>
            {recipe.status === 'to-try' ? 'To Try' : 
             recipe.status === 'made' ? 'Made' : 'Favorite'}
          </span>
        </div>

        {/* Recipe Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {recipe.metadata.cuisineType}
          </span>
          <span className={getDifficultyBadge(recipe.metadata.difficulty)}>
            {recipe.metadata.difficulty}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            ⏱️ {recipe.metadata.preparationTime} min
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            👥 {recipe.metadata.servings} servings
          </span>
        </div>

        {/* Tags */}
        {recipe.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.metadata.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Body - Ingredients & Instructions Preview */}
      <div className="px-6 pb-4">
        {/* Ingredients Preview */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Ingredients:</h4>
          <div className="text-sm text-gray-600">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <div key={index} className="flex items-center mb-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                {ingredient}
              </div>
            ))}
            {recipe.ingredients.length > 3 && (
              <div className="text-gray-500 text-xs mt-1">
                +{recipe.ingredients.length - 3} more ingredients
              </div>
            )}
          </div>
        </div>

        {/* Instructions Preview */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Instructions:</h4>
          <div className="text-sm text-gray-600">
            {recipe.instructions.slice(0, 2).map((instruction, index) => (
              <div key={index} className="flex mb-1">
                <span className="text-gray-400 mr-2 font-medium">{index + 1}.</span>
                <span className="line-clamp-2">{instruction}</span>
              </div>
            ))}
            {recipe.instructions.length > 2 && (
              <div className="text-gray-500 text-xs mt-1">
                +{recipe.instructions.length - 2} more steps
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          {/* Status Change Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              value={recipe.status}
              onChange={handleStatusChange}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="to-try">To Try</option>
              <option value="made">Made</option>
              <option value="favorite">Favorite</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(recipe)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Creation/Update Info */}
        <div className="mt-3 text-xs text-gray-500">
          Created: {formatDate(recipe.createdAt)}
          {recipe.updatedAt !== recipe.createdAt && (
            <span> • Updated: {formatDate(recipe.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}