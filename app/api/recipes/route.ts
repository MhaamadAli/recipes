// app/api/recipes/route.ts
// Single API endpoint that handles all recipe operations
// Uses relative imports to avoid path resolution issues

import { NextRequest, NextResponse } from 'next/server';

// Temporary inline types to avoid import issues
interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  metadata: {
    cuisineType: string;
    preparationTime: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
  };
  status: 'favorite' | 'to-try' | 'made';
  createdAt: Date;
  updatedAt: Date;
}

interface RecipeFormData {
  name: string;
  ingredients: string;
  instructions: string;
  cuisineType: string;
  preparationTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string;
}

interface SearchFilters {
  query: string;
  cuisineType?: string;
  status?: 'favorite' | 'to-try' | 'made';
  maxPrepTime?: number;
}

// In-memory storage with sample data
let recipes: Recipe[] = [
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

// Utility functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

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
    status: 'to-try',
    createdAt: id ? recipes.find(r => r.id === id)?.createdAt || now : now,
    updatedAt: now
  };
}

// GET - Fetch recipes (all or filtered)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is a search request
    const query = searchParams.get('query') || '';
    const cuisineType = searchParams.get('cuisineType') || undefined;
    const status = searchParams.get('status') as any || undefined;
    const maxPrepTime = searchParams.get('maxPrepTime') ? 
      parseInt(searchParams.get('maxPrepTime')!) : undefined;

    // If any search parameters exist, perform search
    if (query || cuisineType || status || maxPrepTime) {
      let filteredRecipes = [...recipes];

      // Filter by search query
      if (query) {
        const queryLower = query.toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.name.toLowerCase().includes(queryLower) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(queryLower)) ||
          recipe.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
          recipe.metadata.cuisineType.toLowerCase().includes(queryLower)
        );
      }

      // Filter by cuisine type
      if (cuisineType) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.metadata.cuisineType.toLowerCase() === cuisineType.toLowerCase()
        );
      }

      // Filter by status
      if (status) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.status === status);
      }

      // Filter by max preparation time
      if (maxPrepTime) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.metadata.preparationTime <= maxPrepTime
        );
      }
      
      return NextResponse.json({
        success: true,
        data: filteredRecipes
      });
    }

    // Otherwise return all recipes
    return NextResponse.json({
      success: true,
      data: recipes
    });

  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch recipes'
    }, { status: 500 });
  }
}

// POST - Create new recipe
export async function POST(request: NextRequest) {
  try {
    const formData: RecipeFormData = await request.json();
    
    // Basic validation
    if (!formData.name?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Recipe name is required'
      }, { status: 400 });
    }

    if (!formData.ingredients?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Ingredients are required'
      }, { status: 400 });
    }

    if (!formData.instructions?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Instructions are required'
      }, { status: 400 });
    }

    // Create the recipe
    const newRecipe = convertFormDataToRecipe(formData);
    recipes.push(newRecipe);
    
    return NextResponse.json({
      success: true,
      data: newRecipe
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/recipes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create recipe'
    }, { status: 500 });
  }
}

// PUT - Update existing recipe or update status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json({
        success: false,
        error: 'Recipe ID is required'
      }, { status: 400 });
    }

    // Check if this is a status update
    if (body.status && !body.name) {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) {
        return NextResponse.json({
          success: false,
          error: 'Recipe not found'
        }, { status: 404 });
      }

      recipe.status = body.status;
      recipe.updatedAt = new Date();

      return NextResponse.json({
        success: true,
        data: recipe
      });
    }

    // Otherwise, this is a full recipe update
    const formData: RecipeFormData = body;
    
    // Basic validation
    if (!formData.name?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Recipe name is required'
      }, { status: 400 });
    }

    const index = recipes.findIndex(recipe => recipe.id === recipeId);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Recipe not found'
      }, { status: 404 });
    }

    const updatedRecipe = convertFormDataToRecipe(formData, recipeId);
    recipes[index] = updatedRecipe;

    return NextResponse.json({
      success: true,
      data: updatedRecipe
    });

  } catch (error) {
    console.error('PUT /api/recipes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update recipe'
    }, { status: 500 });
  }
}

// DELETE - Remove recipe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json({
        success: false,
        error: 'Recipe ID is required'
      }, { status: 400 });
    }

    const index = recipes.findIndex(recipe => recipe.id === recipeId);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Recipe not found'
      }, { status: 404 });
    }

    recipes.splice(index, 1);

    return NextResponse.json({
      success: true,
      data: { id: recipeId }
    });

  } catch (error) {
    console.error('DELETE /api/recipes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete recipe'
    }, { status: 500 });
  }
}