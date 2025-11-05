# Sous.io - AI-Powered Recipe Discovery Setup Guide

## 🚀 Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key from step 1.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

### AI-Powered Recipe Discovery
- Enter ingredients you have available
- AI searches the web for highly rated recipes
- Get 6-8 diverse recipe suggestions

### Recipe Parsing
- Click "Open in Sous" to get a clean, readable recipe
- AI extracts and formats ingredients, instructions, tips, and nutrition
- No more cluttered recipe pages!

### Two Ways to View Recipes
1. **Open in Sous** - Clean, formatted recipe view
2. **View Original** - Link to the original food blog

### Recipe History
- All searches are automatically saved
- View your last 20 recipe searches

### Favorites (Coming Soon)
- Save your favorite recipes
- Access them anytime

## 🎨 Design

The app uses a food-inspired color palette:
- **Fresh Green** (#4CAF50) - Primary actions, healthy ingredients
- **Warm Orange** (#FF9800) - Secondary actions, cooking warmth
- **Tomato Red** (#E53935) - Food-related, appetizing
- **Soft Yellow** (#FBC02D) - Energy, highlights

## 📁 Project Structure

```
app/
├── api/
│   ├── recipes/
│   │   ├── search/route.ts    # AI recipe search
│   │   ├── parse/route.ts     # Recipe parsing
│   │   ├── favorite/route.ts  # Favorites management
│   │   └── history/route.ts   # Search history
│   └── ingredients/
│       └── route.ts            # Ingredients database
├── assets/
│   ├── ingredients.json        # Ingredient database
│   └── recipes.json            # Recipes, favorites, history
├── globals.css                 # Color palette & styles
├── layout.tsx                  # Root layout
└── page.tsx                    # Main application

```

## 🔧 How It Works

### 1. Recipe Search Flow
```
User selects ingredients
    ↓
Frontend calls /api/recipes/search
    ↓
Gemini AI searches for recipes
    ↓
Returns 6-8 recipe suggestions
    ↓
Display in gallery format
```

### 2. Recipe Parsing Flow
```
User clicks "Open in Sous"
    ↓
Frontend calls /api/recipes/parse
    ↓
Gemini AI extracts recipe from URL
    ↓
Returns cleaned, formatted recipe
    ↓
Display in modal with ingredients, instructions, tips
```

## 🛠️ API Endpoints

### POST /api/recipes/search
Search for recipes based on ingredients.

**Request:**
```json
{
  "ingredients": ["chicken", "tomatoes", "garlic"]
}
```

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "id": "recipe_123",
      "title": "Chicken Tikka Masala",
      "description": "Creamy Indian curry",
      "cookTime": "45 mins",
      "servings": "4",
      "sourceUrl": "https://example.com/recipe",
      "imageUrl": "https://example.com/image.jpg",
      "rating": "4.8",
      "ingredients": ["chicken", "tomatoes"],
      "cuisine": "Indian",
      "difficulty": "Medium"
    }
  ]
}
```

### POST /api/recipes/parse
Parse a recipe from a URL.

**Request:**
```json
{
  "sourceUrl": "https://example.com/recipe",
  "title": "Recipe Name"
}
```

**Response:**
```json
{
  "success": true,
  "recipe": {
    "title": "Recipe Name",
    "description": "Brief description",
    "cookTime": "30 mins",
    "servings": "4",
    "ingredients": [
      {"amount": "2 cups", "item": "flour"}
    ],
    "instructions": [
      {"step": 1, "instruction": "Preheat oven"}
    ],
    "tips": ["tip1", "tip2"],
    "nutrition": {
      "calories": "250",
      "protein": "10g"
    }
  }
}
```

### POST /api/recipes/favorite
Toggle favorite status for a recipe.

**Request:**
```json
{
  "recipeId": "recipe_123"
}
```

### GET /api/recipes/favorite
Get all favorited recipes.

### GET /api/recipes/history
Get search history (last 20 searches).

### DELETE /api/recipes/history
Clear search history.

## 🐛 Troubleshooting

### "Gemini API key not configured"
- Make sure you created `.env.local` in the root directory
- Verify the API key is correct
- Restart the development server after adding the key

### "Failed to parse AI response"
- The AI might have returned invalid JSON
- Try searching again
- Check the console for error details

### Recipes not loading
- Check your internet connection
- Verify the Gemini API key is valid
- Check the browser console for errors

## 🚀 Deployment

### Environment Variables
Make sure to set `GEMINI_API_KEY` in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Follow their documentation

### Build
```bash
npm run build
npm start
```

## 📝 Notes

- The app uses Google Gemini AI for recipe discovery and parsing
- Recipes are cached in `app/assets/recipes.json`
- The ingredient database can be extended in `app/assets/ingredients.json`
- All API routes are server-side for security

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Save favorite recipes
- [ ] Recipe collections
- [ ] Shopping list generation
- [ ] Meal planning
- [ ] Recipe ratings and reviews
- [ ] Social sharing
- [ ] Recipe scaling calculator

## 📄 License

MIT License - feel free to use this project for learning or building your own app!

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Google Gemini AI**


