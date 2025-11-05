import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Mock mode toggle - set to true to use mock data instead of real API
const USE_MOCK_DATA = false;

// Mock recipes for testing
const MOCK_RECIPES: Recipe[] = [
  {
    id: "mock_1",
    title: "Creamy Pesto Chicken Pasta",
    description: "A rich and creamy pasta dish with tender chicken and fresh basil pesto.",
    cookTime: "25 mins",
    servings: "4",
    sourceUrl: "https://www.allrecipes.com/recipe/creamypestochicken",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    rating: "4.8",
    ingredients: ["chicken breast", "pesto", "pasta", "parmesan"],
    cuisine: "Italian",
    difficulty: "Easy",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock_2",
    title: "Garlic Parmesan Chicken with Pasta",
    description: "Juicy chicken breast smothered in garlic butter and parmesan cheese, served over pasta.",
    cookTime: "30 mins",
    servings: "4",
    sourceUrl: "https://www.foodnetwork.com/recipes/garlic-parmesan-chicken",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    rating: "4.9",
    ingredients: ["chicken breast", "parmesan", "pasta", "garlic"],
    cuisine: "Italian",
    difficulty: "Medium",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock_3",
    title: "Pesto Pasta with Cherry Tomatoes",
    description: "Fresh pesto pasta tossed with sweet cherry tomatoes and topped with parmesan.",
    cookTime: "20 mins",
    servings: "3",
    sourceUrl: "https://www.tasteofhome.com/recipes/pesto-pasta-tomatoes",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
    rating: "4.7",
    ingredients: ["pesto", "pasta", "parmesan", "tomatoes"],
    cuisine: "Italian",
    difficulty: "Easy",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock_4",
    title: "One-Pot Chicken and Pasta",
    description: "Easy one-pot meal with chicken, pasta, and vegetables in a creamy sauce.",
    cookTime: "35 mins",
    servings: "4",
    sourceUrl: "https://www.delish.com/recipe/one-pot-chicken-pasta",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
    rating: "4.6",
    ingredients: ["chicken breast", "pasta", "parmesan"],
    cuisine: "American",
    difficulty: "Easy",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock_5",
    title: "Pesto Chicken Skillet",
    description: "Quick and easy skillet meal with chicken, vegetables, and pesto sauce.",
    cookTime: "25 mins",
    servings: "4",
    sourceUrl: "https://www.budgetbytes.com/pesto-chicken-skillet",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    rating: "4.5",
    ingredients: ["chicken breast", "pesto", "parmesan"],
    cuisine: "Italian",
    difficulty: "Easy",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock_6",
    title: "Lemon Pesto Pasta",
    description: "Bright and zesty pasta dish with fresh lemon, pesto, and parmesan cheese.",
    cookTime: "15 mins",
    servings: "3",
    sourceUrl: "https://www.simplyrecipes.com/recipes/lemon_pesto_pasta",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    rating: "4.8",
    ingredients: ["pesto", "pasta", "parmesan", "lemon"],
    cuisine: "Italian",
    difficulty: "Easy",
    createdAt: new Date().toISOString()
  }
];

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: string;
  sourceUrl: string;
  imageUrl: string;
  rating: string;
  ingredients: string[];
  cuisine?: string;
  difficulty?: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Recipe search request received');
    const { ingredients } = await request.json();
    console.log('📝 Ingredients:', ingredients);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      console.log('❌ No ingredients provided');
      return NextResponse.json(
        { success: false, error: 'Please provide at least one ingredient' },
        { status: 400 }
      );
    }

    // 🧪 MOCK MODE - Return mock data for testing
    if (USE_MOCK_DATA) {
      console.log('🧪 Using MOCK DATA (no API call)');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Save to history
      const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
      const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));
      recipesData.history.push({
        searchIngredients: ingredients,
        recipes: MOCK_RECIPES,
        timestamp: new Date().toISOString(),
      });
      if (recipesData.history.length > 50) {
        recipesData.history = recipesData.history.slice(-50);
      }
      fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));

      console.log('✅ Returning', MOCK_RECIPES.length, 'mock recipes');
      return NextResponse.json({
        success: true,
        recipes: MOCK_RECIPES,
      });
    }

    // Check if API key is configured
    console.log('🔑 API Key configured:', !!process.env.GEMINI_API_KEY);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      console.log('❌ API key not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file' 
        },
        { status: 500 }
      );
    }

    console.log('🤖 Initializing Gemini AI model: gemini-2.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a recipe discovery assistant. The user has these ingredients available:
${ingredients.join(', ')}

Please find 6-8 highly rated, diverse recipes that can be made with these ingredients. For each recipe, provide:
1. Recipe name
2. Brief description (1 sentence)
3. Cooking time (e.g., "30 mins", "1 hour")
4. Number of servings
5. Source website URL (must be a real, working recipe URL)
6. An image URL (from the recipe page or food image site like Unsplash)
7. Rating (4.0 to 5.0)
8. List of main ingredients used from the user's list
9. Cuisine type (e.g., Italian, Asian, Mexican, etc.)
10. Difficulty level (Easy, Medium, Hard)

Return the response as a JSON array with this exact structure:
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "cookTime": "30 mins",
    "servings": "4",
    "sourceUrl": "https://example.com/recipe",
    "imageUrl": "https://example.com/image.jpg",
    "rating": "4.5",
    "ingredients": ["ingredient1", "ingredient2"],
    "cuisine": "Italian",
    "difficulty": "Easy"
  }
]

Make sure to find REAL, existing recipes from popular cooking websites. Return ONLY valid JSON, no additional text.`;

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Received response from Gemini API (length:', text.length, 'chars)');

    // Parse the JSON response
    let recipes: Recipe[];
    try {
      // Clean up the response (remove markdown code blocks if present)
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipes = JSON.parse(cleanedText);
      console.log('✅ Parsed', recipes.length, 'recipes');
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError);
      console.error('Response text:', text.substring(0, 500));
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Add IDs and timestamps
    const recipesWithIds = recipes.map((recipe, index) => ({
      ...recipe,
      id: `recipe_${Date.now()}_${index}`,
      createdAt: new Date().toISOString(),
    }));

    // Save to history
    const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));
    
    // Add to history
    recipesData.history.push({
      searchIngredients: ingredients,
      recipes: recipesWithIds,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 searches in history
    if (recipesData.history.length > 50) {
      recipesData.history = recipesData.history.slice(-50);
    }

    fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));

    console.log('✅ Successfully returned', recipesWithIds.length, 'recipes');
    return NextResponse.json({
      success: true,
      recipes: recipesWithIds,
    });

  } catch (error: any) {
    console.error('❌ Error searching recipes:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to search recipes',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

