// app/api/ai/recipe-suggestions/route.ts
// API endpoint for AI-powered recipe suggestions using OpenAI
// Self-contained with no external imports to avoid path issues

import { NextRequest, NextResponse } from 'next/server';

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

// Smart fallback suggestions based on ingredients
const generateSmartSuggestions = (ingredients: string, preferences: string): SuggestedRecipe[] => {
  const ingredientList = ingredients.toLowerCase().split(',').map(i => i.trim());
  const prefs = preferences.toLowerCase();
  
  const suggestions: SuggestedRecipe[] = [];

  // Chicken-based recipes
  if (ingredientList.some(i => i.includes('chicken'))) {
    suggestions.push({
      name: 'Garlic Herb Chicken Skillet',
      description: 'A flavorful one-pan chicken dish with herbs and your available vegetables',
      ingredients: [
        '2 chicken breasts, sliced',
        'garlic cloves, minced',
        'mixed herbs (thyme, rosemary)',
        'vegetables from your list',
        'olive oil',
        'salt and pepper',
        'lemon juice'
      ],
      instructions: [
        'Season chicken with salt, pepper, and herbs',
        'Heat olive oil in a large skillet over medium-high heat',
        'Cook chicken until golden brown, about 6-7 minutes per side',
        'Add garlic and cook for 1 minute until fragrant',
        'Add your vegetables and cook until tender',
        'Finish with lemon juice and fresh herbs',
        'Serve hot with rice or potatoes'
      ],
      cuisineType: 'Mediterranean',
      preparationTime: 25,
      servings: 4,
      difficulty: 'Easy',
      tags: ['protein-rich', 'one-pan', 'healthy', 'quick']
    });
  }

  // Pasta-based recipes
  if (ingredientList.some(i => i.includes('pasta') || i.includes('spaghetti') || i.includes('noodle'))) {
    suggestions.push({
      name: 'Fresh Garden Pasta',
      description: 'Light and fresh pasta featuring your available ingredients',
      ingredients: [
        'pasta of choice (8 oz)',
        'olive oil',
        'garlic, minced',
        'fresh vegetables from your list',
        'parmesan cheese, grated',
        'fresh basil or herbs',
        'salt and pepper'
      ],
      instructions: [
        'Cook pasta according to package directions until al dente',
        'Reserve 1 cup pasta water before draining',
        'Heat olive oil in a large pan over medium heat',
        'Sauté garlic until fragrant, about 1 minute',
        'Add your vegetables, cooking until just tender',
        'Toss in cooked pasta with a splash of pasta water',
        'Add parmesan cheese and fresh herbs',
        'Season with salt and pepper to taste'
      ],
      cuisineType: 'Italian',
      preparationTime: 20,
      servings: 4,
      difficulty: 'Easy',
      tags: ['pasta', 'vegetarian', 'fresh', 'quick']
    });
  }

  // Rice-based recipes
  if (ingredientList.some(i => i.includes('rice'))) {
    suggestions.push({
      name: 'Savory Rice Pilaf',
      description: 'A hearty rice dish incorporating your available ingredients',
      ingredients: [
        '1 cup long-grain rice',
        '2 cups chicken or vegetable broth',
        'onion, diced',
        'your protein and vegetables',
        'garlic, minced',
        'herbs and spices',
        'butter or oil'
      ],
      instructions: [
        'Heat butter in a large saucepan over medium heat',
        'Add rice and toast for 2-3 minutes until fragrant',
        'Add onion and garlic, cook until softened',
        'Pour in broth and bring to a boil',
        'Add your protein and harder vegetables',
        'Reduce heat, cover, and simmer for 18-20 minutes',
        'Add softer vegetables in the last 5 minutes',
        'Let stand 5 minutes, then fluff with a fork'
      ],
      cuisineType: 'Mediterranean',
      preparationTime: 35,
      servings: 6,
      difficulty: 'Medium',
      tags: ['rice', 'one-pot', 'filling', 'comfort-food']
    });
  }

  // Vegetable-heavy recipes
  if (ingredientList.some(i => ['tomato', 'onion', 'carrot', 'bell pepper', 'zucchini', 'mushroom'].some(veg => i.includes(veg)))) {
    suggestions.push({
      name: 'Mediterranean Vegetable Medley',
      description: 'A colorful and nutritious vegetable dish bursting with Mediterranean flavors',
      ingredients: [
        'mixed vegetables from your list',
        'olive oil',
        'garlic, minced',
        'onion, sliced',
        'canned diced tomatoes',
        'herbs (oregano, basil, thyme)',
        'feta cheese (optional)',
        'salt and pepper'
      ],
      instructions: [
        'Heat olive oil in a large skillet or dutch oven',
        'Sauté onion until softened, about 5 minutes',
        'Add garlic and cook for 1 minute',
        'Add harder vegetables first, cook for 5-7 minutes',
        'Add tomatoes and herbs, season with salt and pepper',
        'Simmer for 15-20 minutes until vegetables are tender',
        'Add softer vegetables in the last 5 minutes',
        'Serve hot, optionally topped with feta cheese'
      ],
      cuisineType: 'Mediterranean',
      preparationTime: 30,
      servings: 4,
      difficulty: 'Easy',
      tags: ['vegetarian', 'healthy', 'mediterranean', 'colorful']
    });
  }

  // Egg-based recipes
  if (ingredientList.some(i => i.includes('egg'))) {
    suggestions.push({
      name: 'Rustic Vegetable Frittata',
      description: 'A protein-packed frittata featuring your fresh ingredients',
      ingredients: [
        '8 large eggs',
        'vegetables from your list, chopped',
        'cheese (optional)',
        'olive oil or butter',
        'onion, diced',
        'herbs (parsley, chives)',
        'salt and pepper'
      ],
      instructions: [
        'Preheat oven to 375°F (190°C)',
        'Heat oil in an oven-safe skillet over medium heat',
        'Sauté onion and harder vegetables until softened',
        'Beat eggs with salt, pepper, and herbs',
        'Pour eggs over vegetables in the skillet',
        'Cook for 3-4 minutes until edges start to set',
        'Sprinkle with cheese if using',
        'Transfer to oven and bake for 12-15 minutes until set',
        'Let cool slightly before slicing and serving'
      ],
      cuisineType: 'Italian',
      preparationTime: 25,
      servings: 6,
      difficulty: 'Easy',
      tags: ['eggs', 'protein-rich', 'brunch', 'versatile']
    });
  }

  // Filter based on preferences
  let filteredSuggestions = suggestions;
  
  if (prefs.includes('vegetarian')) {
    filteredSuggestions = suggestions.filter(s => s.tags.includes('vegetarian') || !s.ingredients.some(ing => 
      ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('meat') || ing.toLowerCase().includes('fish')
    ));
  }
  
  if (prefs.includes('quick') || prefs.includes('30 min') || prefs.includes('fast')) {
    filteredSuggestions = filteredSuggestions.filter(s => s.preparationTime <= 30);
  }
  
  if (prefs.includes('easy')) {
    filteredSuggestions = filteredSuggestions.filter(s => s.difficulty === 'Easy');
  }

  // Return 2-4 suggestions
  return filteredSuggestions.slice(0, Math.min(4, Math.max(2, filteredSuggestions.length)));
};

// POST - Generate recipe suggestions
export async function POST(request: NextRequest) {
  try {
    const { ingredients, preferences } = await request.json();

    // Validate input
    if (!ingredients || typeof ingredients !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Ingredients are required'
      }, { status: 400 });
    }

    if (ingredients.trim().length < 3) {
      return NextResponse.json({
        success: false,
        error: 'Please provide at least a few ingredients'
      }, { status: 400 });
    }

    // Check if OpenAI is available
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    
    if (hasOpenAI) {
      try {
        // Try to import and use OpenAI
        const { default: OpenAI } = await import('openai');
        
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `You are a professional chef and recipe developer. Generate creative, practical recipes based on available ingredients. Always respond with valid JSON only, no additional text.`;

        const userPrompt = `Generate 3-4 recipe suggestions based on these available ingredients: ${ingredients}

${preferences ? `Additional preferences: ${preferences}` : ''}

Requirements:
- Use as many of the provided ingredients as possible
- Create realistic, cookable recipes
- Include prep time estimates
- Make recipes accessible for home cooks
- Vary the cuisine types and difficulty levels

Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief appetizing description (1-2 sentences)",
    "ingredients": ["specific ingredient 1 with amount", "ingredient 2 with amount"],
    "instructions": ["detailed step 1", "detailed step 2"],
    "cuisineType": "Italian|Mexican|Asian|Indian|Mediterranean|American|French|Other",
    "preparationTime": 30,
    "servings": 4,
    "difficulty": "Easy|Medium|Hard",
    "tags": ["relevant", "descriptive", "tags"]
  }
]`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 2000
        });

        const responseContent = completion.choices[0].message.content;
        
        if (responseContent) {
          try {
            let suggestions = JSON.parse(responseContent);
            
            // Validate the response
            if (Array.isArray(suggestions) && suggestions.length > 0) {
              const validSuggestions = suggestions.filter(recipe => {
                return recipe.name && 
                       recipe.description && 
                       Array.isArray(recipe.ingredients) && 
                       Array.isArray(recipe.instructions) &&
                       recipe.cuisineType &&
                       typeof recipe.preparationTime === 'number' &&
                       typeof recipe.servings === 'number' &&
                       recipe.difficulty &&
                       Array.isArray(recipe.tags);
              });

              if (validSuggestions.length > 0) {
                return NextResponse.json({
                  success: true,
                  data: validSuggestions,
                  source: 'openai'
                });
              }
            }
          } catch (parseError) {
            console.log('Failed to parse OpenAI response, using fallback');
          }
        }
      } catch (aiError: any) {
        console.log('OpenAI error, using fallback:', aiError.message);
      }
    }

    // Use smart fallback suggestions
    const suggestions = generateSmartSuggestions(ingredients, preferences || '');
    
    return NextResponse.json({
      success: true,
      data: suggestions,
      source: hasOpenAI ? 'fallback' : 'smart-suggestions',
      note: hasOpenAI ? 'OpenAI temporarily unavailable, using smart suggestions' : 'Using smart ingredient-based suggestions'
    });

  } catch (error: any) {
    console.error('Recipe suggestions error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recipe suggestions'
    }, { status: 500 });
  }
}

// GET - Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Recipe Suggestions API is running',
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
}