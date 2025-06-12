// app/api/recipes/route.ts
// Single API endpoint that handles all recipe operations
// Uses HTTP methods (GET, POST, PUT, DELETE) to determine action

import { NextRequest, NextResponse } from 'next/server';
import { recipeStorage } from '@/lib/data';
import { RecipeFormData, SearchFilters } from '@/lib/types';

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
      const filters: SearchFilters = {
        query,
        cuisineType,
        status,
        maxPrepTime
      };
      
      const filteredRecipes = recipeStorage.search(filters);
      return NextResponse.json({
        success: true,
        data: filteredRecipes
      });
    }

    // Otherwise return all recipes
    const recipes = recipeStorage.getAll();
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
    const newRecipe = recipeStorage.create(formData);
    
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
      const updatedRecipe = recipeStorage.updateStatus(recipeId, body.status);
      
      if (!updatedRecipe) {
        return NextResponse.json({
          success: false,
          error: 'Recipe not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: updatedRecipe
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

    const updatedRecipe = recipeStorage.update(recipeId, formData);
    
    if (!updatedRecipe) {
      return NextResponse.json({
        success: false,
        error: 'Recipe not found'
      }, { status: 404 });
    }

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

    const success = recipeStorage.delete(recipeId);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Recipe not found'
      }, { status: 404 });
    }

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