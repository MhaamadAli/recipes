// lib/data.ts
// Simple in-memory data storage for recipes
// In production, this would be replaced with a database

import { Recipe, RecipeFormData, SearchFilters } from './types';

// In-memory storage - gets reset on server restart
let recipes: Recipe[] = [
  // Sample data to start with
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g parmesan', 'black pepper'],
    instructions: [
      'Cook spaghetti in salted water until al dente',
      'Fry pancetta until crispy',
      'Beat eggs with parmesan and pepper',
      'Mix hot pasta with egg mixture off heat',
      'Add pancetta and serve immediately'
    ],
    metadata: {
      cuisineType: 'Italian',
      preparationTime: 30,
      servings: 4,
      difficulty: 'Medium',
      tags: ['pasta', 'quick', 'comfort-food']
    },
    status: 'favorite',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Chicken Teriyaki',
    ingredients: ['2 chicken breasts', '3 tbsp soy sauce', '2 tbsp honey', '1 tbsp rice vinegar', 'ginger', 'garlic'],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Make teriyaki sauce with soy sauce, honey, vinegar',
      'Cook chicken in pan until golden',
      'Add sauce and simmer until glazed',
      'Serve with rice and vegetables'
    ],
    metadata: {
      cuisineType: 'Japanese',
      preparationTime: 25,
      servings: 2,
      difficulty: 'Easy',
      tags: ['chicken', 'asian', 'healthy']
    },
    status: 'made',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
];

// Generate unique ID for new recipes
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Convert form data to Recipe object
function convertFormDataToRecipe(formData: RecipeFormData, id?: string): Recipe {
  const now = new Date();
  
  return {
    id: id || generateId(),
    name: formData.name.trim(),
    ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0),
    instructions: formData.instructions.split('\n').map(i => i.trim()).filter(i => i.length > 0),
    metadata: {
      cuisineType: formData.cuisineType.trim(),
      preparationTime: formData.preparationTime,
      servings: formData.servings,
      difficulty: formData.difficulty,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    },
    status: 'to-try', // Default status for new recipes
    createdAt: id ? recipes.find(r => r.id === id)?.createdAt || now : now,
    updatedAt: now
  };
}

// CRUD Operations
export const recipeStorage = {
  // Get all recipes
  getAll(): Recipe[] {
    return [...recipes]; // Return copy to prevent direct mutation
  },

  // Get recipe by ID
  getById(id: string): Recipe | undefined {
    return recipes.find(recipe => recipe.id === id);
  },

  // Create new recipe
  create(formData: RecipeFormData): Recipe {
    const newRecipe = convertFormDataToRecipe(formData);
    recipes.push(newRecipe);
    return newRecipe;
  },

  // Update existing recipe
  update(id: string, formData: RecipeFormData): Recipe | null {
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index === -1) return null;

    const updatedRecipe = convertFormDataToRecipe(formData, id);
    recipes[index] = updatedRecipe;
    return updatedRecipe;
  },

  // Delete recipe
  delete(id: string): boolean {
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index === -1) return false;

    recipes.splice(index, 1);
    return true;
  },

  // Update recipe status (favorite, to-try, made)
  updateStatus(id: string, status: Recipe['status']): Recipe | null {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return null;

    recipe.status = status;
    recipe.updatedAt = new Date();
    return recipe;
  },

  // Search and filter recipes
  search(filters: SearchFilters): Recipe[] {
    let filteredRecipes = [...recipes];

    // Filter by search query (name, ingredients, or tags)
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query)) ||
        recipe.metadata.tags.some(tag => tag.toLowerCase().includes(query)) ||
        recipe.metadata.cuisineType.toLowerCase().includes(query)
      );
    }

    // Filter by cuisine type
    if (filters.cuisineType) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.metadata.cuisineType.toLowerCase() === filters.cuisineType!.toLowerCase()
      );
    }

    // Filter by status
    if (filters.status) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.status === filters.status);
    }

    // Filter by max preparation time
    if (filters.maxPrepTime) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.metadata.preparationTime <= filters.maxPrepTime!
      );
    }

    return filteredRecipes;
  }
};