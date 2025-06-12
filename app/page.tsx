// app/page.tsx
// Main dashboard page that combines all components
// Handles state management and API calls

'use client';

import { useState, useEffect } from 'react';
import { Recipe, RecipeFormData, SearchFilters, RecipeStatus } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import RecipeCard from '@/components/RecipeCard';
import RecipeForm from '@/components/RecipeForm';

export default function HomePage() {
  // State management
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);

  // Search state
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({ query: '' });

  // Load recipes on component mount
  useEffect(() => {
    loadRecipes();
  }, []);

  // Apply filters whenever recipes or active filters change
  useEffect(() => {
    applyFilters();
  }, [recipes, activeFilters]);

  // Load all recipes from API
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipes');
      const result = await response.json();

      if (result.success) {
        setRecipes(result.data);
      } else {
        setError(result.error || 'Failed to load recipes');
      }
    } catch (err) {
      console.error('Load recipes error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Apply current filters to recipes
  const applyFilters = async () => {
    // If no filters are active, show all recipes
    if (!activeFilters.query && !activeFilters.cuisineType && 
        !activeFilters.status && !activeFilters.maxPrepTime) {
      setFilteredRecipes(recipes);
      return;
    }

    try {
      // Build query parameters for API call
      const params = new URLSearchParams();
      if (activeFilters.query) params.append('query', activeFilters.query);
      if (activeFilters.cuisineType) params.append('cuisineType', activeFilters.cuisineType);
      if (activeFilters.status) params.append('status', activeFilters.status);
      if (activeFilters.maxPrepTime) params.append('maxPrepTime', activeFilters.maxPrepTime.toString());

      const response = await fetch(`/api/recipes?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setFilteredRecipes(result.data);
      } else {
        console.error('Search error:', result.error);
        setFilteredRecipes([]);
      }
    } catch (err) {
      console.error('Filter error:', err);
      setFilteredRecipes(recipes); // Fallback to showing all recipes
    }
  };

  // Handle search filter changes
  const handleSearch = (filters: SearchFilters) => {
    setActiveFilters(filters);
  };

  // Open form for adding new recipe
  const handleAddRecipe = () => {
    setEditingRecipe(undefined);
    setIsFormOpen(true);
  };

  // Open form for editing existing recipe
  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  // Close form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  // Submit form (add or edit)
  const handleSubmitForm = async (formData: RecipeFormData) => {
    try {
      if (editingRecipe) {
        // Update existing recipe
        const response = await fetch(`/api/recipes?id=${editingRecipe.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
          // Update recipe in local state
          setRecipes(prev => prev.map(r => 
            r.id === editingRecipe.id ? result.data : r
          ));
        } else {
          throw new Error(result.error);
        }
      } else {
        // Create new recipe
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
          // Add new recipe to local state
          setRecipes(prev => [result.data, ...prev]);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      throw err; // Re-throw to let form handle the error
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        // Remove recipe from local state
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete recipe: ' + result.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recipe');
    }
  };

  // Change recipe status
  const handleStatusChange = async (id: string, status: RecipeStatus) => {
    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      if (result.success) {
        // Update recipe status in local state
        setRecipes(prev => prev.map(r => 
          r.id === id ? { ...r, status, updatedAt: new Date() } : r
        ));
      } else {
        alert('Failed to update status: ' + result.error);
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

  // Get recipe count summary
  const getRecipeSummary = () => {
    const total = recipes.length;
    const favorites = recipes.filter(r => r.status === 'favorite').length;
    const toTry = recipes.filter(r => r.status === 'to-try').length;
    const made = recipes.filter(r => r.status === 'made').length;
    
    return { total, favorites, toTry, made };
  };

  const summary = getRecipeSummary();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Recipe Collection</h1>
              <p className="text-gray-600 mt-1">
                Manage your favorite recipes with ease
              </p>
            </div>
            <button
              onClick={handleAddRecipe}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Recipe
            </button>
          </div>

          {/* Recipe Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-800">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Recipes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{summary.favorites}</div>
              <div className="text-sm text-red-600">Favorites</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.toTry}</div>
              <div className="text-sm text-yellow-600">To Try</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{summary.made}</div>
              <div className="text-sm text-green-600">Made Before</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          initialFilters={activeFilters}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Loading recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading recipes:</p>
            <p>{error}</p>
            <button 
              onClick={loadRecipes}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && (
          <>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </p>
              
              {filteredRecipes.length !== recipes.length && (
                <button
                  onClick={() => handleSearch({ query: '' })}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Recipe Cards */}
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={handleEditRecipe}
                    onDelete={handleDeleteRecipe}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {recipes.length === 0 ? 'No recipes yet' : 'No recipes match your filters'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {recipes.length === 0 
                    ? 'Start building your recipe collection by adding your first recipe!'
                    : 'Try adjusting your search criteria or clearing the filters.'
                  }
                </p>
                {recipes.length === 0 && (
                  <button
                    onClick={handleAddRecipe}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Add Your First Recipe
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Recipe Form Modal */}
      <RecipeForm
        recipe={editingRecipe}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
}