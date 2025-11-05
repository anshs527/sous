import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));

    // Return last 20 searches
    const recentHistory = recipesData.history.slice(-20).reverse();

    return NextResponse.json({
      success: true,
      history: recentHistory,
    });

  } catch (error) {
    console.error('Error getting history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const recipesFilePath = path.join(process.cwd(), 'app/assets/recipes.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesFilePath, 'utf-8'));

    // Clear history
    recipesData.history = [];

    fs.writeFileSync(recipesFilePath, JSON.stringify(recipesData, null, 2));

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}


