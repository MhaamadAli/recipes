// lib/types.ts
// Core type definitions for the Recipe Management System

export interface Recipe {
    id: string;                    // Unique identifier for each recipe
    name: string;                  // Recipe name/title
    ingredients: string[];         // Array of ingredients
    instructions: string[];        // Step-by-step cooking instructions
    metadata: RecipeMetadata;      // Additional recipe information
    status: RecipeStatus;          // Current status (favorite, to-try, made)
    createdAt: Date;              // When the recipe was created
    updatedAt: Date;              // Last modification date
  }
  
  export interface RecipeMetadata {
    cuisineType: string;           // e.g., "Italian", "Mexican", "Asian"
    preparationTime: number;       // Time in minutes
    servings: number;              // Number of servings
    difficulty: 'Easy' | 'Medium' | 'Hard';  // Cooking difficulty level
    tags: string[];                // Additional tags like "vegetarian", "gluten-free"
  }
  
  export type RecipeStatus = 'favorite' | 'to-try' | 'made';
  
  // Form data interface for creating/editing recipes
  export interface RecipeFormData {
    name: string;
    ingredients: string;           // Comma-separated string (will be split into array)
    instructions: string;          // Newline-separated string (will be split into array)
    cuisineType: string;
    preparationTime: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string;                  // Comma-separated string
  }
  
  // Search/filter criteria
  export interface SearchFilters {
    query: string;                 // General search term
    cuisineType?: string;          // Filter by cuisine
    status?: RecipeStatus;         // Filter by status
    maxPrepTime?: number;          // Maximum preparation time
  }
  
  // API response types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface RecipeApiResponse extends ApiResponse<Recipe> {}
  export interface RecipesApiResponse extends ApiResponse<Recipe[]> {}