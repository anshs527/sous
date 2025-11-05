import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Mock mode toggle - set to true to use mock data instead of real API
const USE_MOCK_DATA = false;

// Mock parsed recipe for testing
const MOCK_PARSED_RECIPE = {
  title: "Creamy Pesto Chicken Pasta",
  description: "A rich and creamy pasta dish with tender chicken and fresh basil pesto.",
  cookTime: "25 mins",
  servings: "4",
  ingredients: [
    { amount: "1 lb", item: "chicken breast, diced" },
    { amount: "12 oz", item: "penne pasta" },
    { amount: "1/2 cup", item: "pesto sauce" },
    { amount: "1/2 cup", item: "heavy cream" },
    { amount: "1/2 cup", item: "parmesan cheese, grated" },
    { amount: "2 cloves", item: "garlic, minced" },
    { amount: "2 tbsp", item: "olive oil" },
    { amount: "to taste", item: "salt and pepper" }
  ],
  instructions: [
    { step: 1, instruction: "Bring a large pot of salted water to a boil. Add pasta and cook according to package directions until al dente. Drain and set aside." },
    { step: 2, instruction: "Heat olive oil in a large skillet over medium-high heat. Add diced chicken and season with salt and pepper. Cook until golden and cooked through, about 6-8 minutes." },
    { step: 3, instruction: "Add minced garlic to the skillet and cook for 1 minute until fragrant." },
    { step: 4, instruction: "Reduce heat to medium and add pesto sauce and heavy cream. Stir until well combined." },
    { step: 5, instruction: "Add the cooked pasta to the skillet and toss to coat with the sauce." },
    { step: 6, instruction: "Stir in grated parmesan cheese until melted and creamy." },
    { step: 7, instruction: "Season with additional salt and pepper to taste. Serve hot, garnished with extra parmesan if desired." }
  ],
  tips: [
    "For best results, use fresh pesto sauce or make your own with fresh basil.",
    "Reserve 1/2 cup of pasta water before draining - you can add it to the sauce if it gets too thick.",
    "Add cherry tomatoes or spinach for extra color and nutrition.",
    "Leftovers can be stored in the refrigerator for up to 3 days."
  ],
  nutrition: {
    calories: "485",
    protein: "32g",
    carbs: "45g",
    fat: "18g"
  }
};

interface ParsedRecipe {
  title: string;
  description: string;
  cookTime: string;
  servings: string;
  ingredients: Array<{ amount: string; item: string }>;
  instructions: Array<{ step: number; instruction: string }>;
  tips?: string[];
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { sourceUrl, title } = await request.json();

    if (!sourceUrl) {
      return NextResponse.json(
        { success: false, error: 'Source URL is required' },
        { status: 400 }
      );
    }

    // 🧪 MOCK MODE - Return mock parsed recipe for testing
    if (USE_MOCK_DATA) {
      console.log('🧪 Using MOCK PARSED RECIPE (no API call)');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      return NextResponse.json({
        success: true,
        recipe: MOCK_PARSED_RECIPE,
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gemini API key not configured' 
        },
        { status: 500 }
      );
    }

    console.log('🤖 Initializing Gemini AI model: gemini-2.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a recipe parser. Please extract and clean up the recipe from this URL: ${sourceUrl}

Recipe Title: ${title || 'Unknown'}

Please extract the following information and return it as clean, readable JSON:

1. Title
2. Description (brief overview)
3. Cooking time (e.g., "30 mins", "1 hour")
4. Number of servings
5. Ingredients list (as array of {amount: string, item: string})
6. Step-by-step instructions (as array of {step: number, instruction: string})
7. Optional cooking tips
8. Optional nutrition info (if available)

Return ONLY valid JSON in this exact format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "cookTime": "30 mins",
  "servings": "4",
  "ingredients": [
    {"amount": "2 cups", "item": "flour"},
    {"amount": "1 tsp", "item": "salt"}
  ],
  "instructions": [
    {"step": 1, "instruction": "Preheat oven to 350°F"},
    {"step": 2, "instruction": "Mix ingredients"}
  ],
  "tips": ["tip1", "tip2"],
  "nutrition": {
    "calories": "250",
    "protein": "10g",
    "carbs": "30g",
    "fat": "8g"
  }
}

Make the instructions clear, concise, and easy to follow. Return ONLY JSON, no additional text.`;

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Received response from Gemini API (length:', text.length, 'chars)');

    // Parse the JSON response
    let parsedRecipe: ParsedRecipe;
    try {
      // Clean up the response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedRecipe = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { success: false, error: 'Failed to parse recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe: parsedRecipe,
    });

  } catch (error) {
    console.error('Error parsing recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse recipe' },
      { status: 500 }
    );
  }
}

