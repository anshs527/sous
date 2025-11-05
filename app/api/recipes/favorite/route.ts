import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));

    // Check if already favorited
    const isFavorited = recipesData.favorites.includes(recipeId);

    if (isFavorited) {
      // Remove from favorites
      recipesData.favorites = recipesData.favorites.filter((id: string) => id !== recipeId);
    } else {
      // Add to favorites
      recipesData.favorites.push(recipeId);
    }

    fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));

    return NextResponse.json({
      success: true,
      isFavorited: !isFavorited,
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));

    return NextResponse.json({
      success: true,
      favorites: recipesData.favorites,
    });

  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get favorites' },
      { status: 500 }
    );
  }
}


