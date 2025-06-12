// components/RecipeSuggestions.tsx
// AI-powered recipe suggestions based on available ingredients
// Uses OpenAI API to generate recipe recommendations

'use client';

import { useState } from 'react';
import { RecipeFormData } from '@/lib/types';

interface SuggestedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: string;
  preparationTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

interface RecipeSuggestionsProps {
  onSelectRecipe: (recipe: RecipeFormData) => void;  // Callback when user selects a suggested recipe
  onClose: () => void;                               // Callback to close suggestions panel
  isOpen: boolean;                                   // Panel visibility state
}

export default function RecipeSuggestions({ onSelectRecipe, onClose, isOpen }: RecipeSuggestionsProps) {
  // Component state
  const [availableIngredients, setAvailableIngredients] = useState<string>('');
  const [preferences, setPreferences] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SuggestedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string>(''); // Track if using real AI or fallback

  // Generate AI recipe suggestions
  const generateSuggestions = async () => {
    if (!availableIngredients.trim()) {
      setError('Please enter some ingredients you have available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recipe-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: availableIngredients,
          preferences: preferences
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuggestions(result.data);
        setAiSource(result.source || 'fallback');
        if (result.note) {
          console.log('Note:', result.note);
        }
      } else {
        setError(result.error || 'Failed to generate suggestions');
      }
    } catch (err) {
      console.error('AI suggestions error:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert suggested recipe to form data format
  const convertToFormData = (suggestion: SuggestedRecipe): RecipeFormData => {
    return {
      name: suggestion.name,
      ingredients: suggestion.ingredients.join(', '),
      instructions: suggestion.instructions.join('\n'),
      cuisineType: suggestion.cuisineType,
      preparationTime: suggestion.preparationTime,
      servings: suggestion.servings,
      difficulty: suggestion.difficulty,
      tags: suggestion.tags.join(', ')
    };
  };

  // Handle selecting a suggested recipe
  const handleSelectRecipe = (suggestion: SuggestedRecipe) => {
    const formData = convertToFormData(suggestion);
    onSelectRecipe(formData);
    onClose();
  };

  // Clear all data and close
  const handleClose = () => {
    setAvailableIngredients('');
    setPreferences('');
    setSuggestions([]);
    setError(null);
    setAiSource('');
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Recipe Suggestions</h2>
            <p className="text-gray-600 mt-1">Tell us what ingredients you have, and we'll suggest recipes!</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Input Section */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Available Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Ingredients *
              </label>
              <textarea
                value={availableIngredients}
                onChange={(e) => setAvailableIngredients(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="e.g., chicken breast, onions, garlic, rice, tomatoes"
              />
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferences (optional)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="e.g., vegetarian, under 30 minutes, spicy, Italian cuisine"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-4">
            <button
              onClick={generateSuggestions}
              disabled={isLoading || !availableIngredients.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Suggestions...
                </span>
              ) : (
                '🤖 Get AI Recipe Suggestions'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Suggestions Results */}
        <div className="p-6">
          {suggestions.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Suggested Recipes ({suggestions.length})
                </h3>
                {aiSource && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    aiSource === 'openai' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {aiSource === 'openai' ? '🤖 AI Generated' : '⚡ Quick Suggestions'}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Recipe Header */}
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">{suggestion.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    </div>

                    {/* Recipe Meta */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {suggestion.cuisineType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {suggestion.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        ⏱️ {suggestion.preparationTime} min
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        👥 {suggestion.servings} servings
                      </span>
                    </div>

                    {/* Ingredients Preview */}
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Key Ingredients:</h5>
                      <div className="text-sm text-gray-600">
                        {suggestion.ingredients.slice(0, 4).map((ingredient, idx) => (
                          <span key={idx} className="inline-block mr-2">
                            • {ingredient}
                          </span>
                        ))}
                        {suggestion.ingredients.length > 4 && (
                          <span className="text-gray-500">+{suggestion.ingredients.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* Instructions Preview */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Steps:</h5>
                      <div className="text-sm text-gray-600">
                        {suggestion.instructions.slice(0, 2).map((step, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">{idx + 1}.</span> {step.slice(0, 60)}
                            {step.length > 60 && '...'}
                          </div>
                        ))}
                        {suggestion.instructions.length > 2 && (
                          <div className="text-gray-500 text-xs">+{suggestion.instructions.length - 2} more steps</div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {suggestion.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectRecipe(suggestion)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Use This Recipe
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && suggestions.length === 0 && !error && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Generate Suggestions</h3>
              <p className="text-gray-500">
                Enter your available ingredients above and let AI suggest perfect recipes for you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}