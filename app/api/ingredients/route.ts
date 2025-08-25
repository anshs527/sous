import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to your ingredients JSON file
const INGREDIENTS_FILE_PATH = path.join(process.cwd(), 'app', 'assets', 'ingredients.json');

interface IngredientsData {
  ingredients: string[];
}

// GET - Retrieve all ingredients
export async function GET() {
  try {
    const fileContents = await fs.readFile(INGREDIENTS_FILE_PATH, 'utf8');
    const data: IngredientsData = JSON.parse(fileContents);
    
    return NextResponse.json({
      success: true,
      ingredients: data.ingredients.sort()
    });
  } catch (error) {
    console.error('Error reading ingredients file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load ingredients' },
      { status: 500 }
    );
  }
}

// POST - Add new ingredient
export async function POST(request: NextRequest) {
  try {
    const { ingredient } = await request.json();

    // Validate input
    if (!ingredient || typeof ingredient !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid ingredient provided' },
        { status: 400 }
      );
    }

    const normalizedIngredient = ingredient.toLowerCase().trim();

    // Validate ingredient length and content
    if (normalizedIngredient.length < 2 || normalizedIngredient.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Ingredient must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Read current ingredients
    const fileContents = await fs.readFile(INGREDIENTS_FILE_PATH, 'utf8');
    const data: IngredientsData = JSON.parse(fileContents);

    // Check if ingredient already exists (case-insensitive)
    const existingIngredient = data.ingredients.find(
      item => item.toLowerCase() === normalizedIngredient
    );

    if (existingIngredient) {
      return NextResponse.json({
        success: true,
        message: 'Ingredient already exists',
        ingredient: existingIngredient
      });
    }

    // Add new ingredient and sort the list
    data.ingredients.push(normalizedIngredient);
    data.ingredients.sort();

    // Write back to file
    await fs.writeFile(INGREDIENTS_FILE_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Ingredient added successfully',
      ingredient: normalizedIngredient
    });

  } catch (error) {
    console.error('Error adding ingredient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add ingredient' },
      { status: 500 }
    );
  }
}

// DELETE - Remove ingredient (optional feature)
export async function DELETE(request: NextRequest) {
  try {
    const { ingredient } = await request.json();

    if (!ingredient || typeof ingredient !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid ingredient provided' },
        { status: 400 }
      );
    }

    const normalizedIngredient = ingredient.toLowerCase().trim();

    // Read current ingredients
    const fileContents = await fs.readFile(INGREDIENTS_FILE_PATH, 'utf8');
    const data: IngredientsData = JSON.parse(fileContents);

    // Find and remove ingredient
    const initialLength = data.ingredients.length;
    data.ingredients = data.ingredients.filter(
      item => item.toLowerCase() !== normalizedIngredient
    );

    if (data.ingredients.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // Write back to file
    await fs.writeFile(INGREDIENTS_FILE_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Ingredient removed successfully'
    });

  } catch (error) {
    console.error('Error removing ingredient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove ingredient' },
      { status: 500 }
    );
  }
}