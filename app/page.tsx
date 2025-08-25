"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Moon, Sun, ChefHat, Clock, Users } from 'lucide-react';

// Type definitions
interface Recipe {
  id: number;
  title: string;
  cookTime: string;
  servings: number;
  rating: number;
  image: string;
  ingredients: string[];
  description: string;
}

interface IngredientsData {
  ingredients: string[];
}

// Initial ingredients from your JSON file
const INITIAL_INGREDIENTS: string[] = [
  "chicken breast", "chicken thighs", "whole chicken", "ground beef", "beef steak",
  "pork chops", "ground pork", "ham", "lamb chops", "turkey breast",
  "duck", "sausage", "salami", "salmon", "tuna", "cod", "tilapia", "shrimp",
  "scallops", "mussels", "clams", "lobster", "crab", "sardines", "anchovies",
  "milk", "cheddar cheese", "mozzarella", "parmesan", "feta cheese",
  "yogurt", "cream cheese", "sour cream", "heavy cream", "condensed milk",
  "evaporated milk", "cottage cheese", "ricotta", "tomatoes", "onions", "garlic",
  "bell peppers", "mushrooms", "spinach", "kale", "carrots", "potatoes",
  "sweet potatoes", "broccoli", "cauliflower", "zucchini", "cucumber", "eggplant",
  "lettuce", "celery", "cabbage", "beets", "asparagus", "brussels sprouts",
  "radish", "green beans", "peas", "corn", "apple", "banana", "orange", "lemon",
  "lime", "grapes", "pear", "peach", "plum", "mango", "pineapple", "papaya",
  "kiwi", "watermelon", "cantaloupe", "strawberries", "blueberries", "raspberries",
  "blackberries", "cherries", "pomegranate", "fig", "dates", "avocado", "basil",
  "oregano", "thyme", "parsley", "cilantro", "dill", "rosemary", "sage", "chives",
  "mint", "tarragon", "bay leaves", "rice", "brown rice", "quinoa", "couscous",
  "barley", "bulgur", "oats", "pasta", "bread", "flour", "cornmeal", "tortilla",
  "noodles", "black beans", "kidney beans", "pinto beans", "chickpeas", "lentils",
  "edamame", "green peas", "split peas", "olive oil", "vegetable oil", "canola oil",
  "sesame oil", "soy sauce", "fish sauce", "hot sauce", "mustard", "ketchup",
  "mayonnaise", "vinegar", "balsamic vinegar", "apple cider vinegar", "rice vinegar",
  "worcestershire sauce", "teriyaki sauce", "peanut butter", "tahini", "honey",
  "maple syrup", "black pepper", "salt", "paprika", "cumin", "coriander", "turmeric",
  "cinnamon", "nutmeg", "cloves", "cardamom", "ginger", "chili powder",
  "red pepper flakes", "cayenne pepper", "allspice", "mustard seeds", "fennel seeds",
  "star anise", "vanilla extract", "almonds", "walnuts", "cashews", "peanuts",
  "pistachios", "pecans", "sunflower seeds", "pumpkin seeds", "chia seeds",
  "flaxseeds", "sesame seeds", "baking powder", "baking soda", "yeast", "cornstarch",
  "cocoa powder", "chocolate chips", "powdered sugar", "brown sugar", "granulated sugar",
  "molasses", "coffee", "tea", "green tea", "black tea", "orange juice", "apple juice",
  "coconut water", "canned tomatoes", "tomato paste", "tomato sauce", "canned corn",
  "canned beans", "coconut milk", "pickles", "olives", "jam", "jelly", "broth",
  "stock", "frozen peas", "frozen spinach", "frozen corn", "frozen berries",
  "frozen pizza", "frozen fries", "frozen shrimp"
];

// Mock recipe data with sample recipes
const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Creamy Garlic Chicken with Mushrooms",
    cookTime: "30 mins",
    servings: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
    ingredients: ['chicken breast', 'mushrooms', 'garlic', 'milk', 'butter'],
    description: "A rich and creamy chicken dish perfect for weeknight dinners."
  },
  {
    id: 2,
    title: "Mediterranean Quinoa Bowl",
    cookTime: "25 mins",
    servings: 2,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    ingredients: ['quinoa', 'tomatoes', 'chickpeas', 'spinach', 'olive oil'],
    description: "Fresh and healthy Mediterranean-inspired bowl packed with nutrients."
  },
  {
    id: 3,
    title: "Honey Glazed Salmon",
    cookTime: "20 mins",
    servings: 3,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    ingredients: ['salmon', 'honey', 'soy sauce', 'ginger', 'garlic'],
    description: "Perfectly glazed salmon with Asian-inspired flavors."
  }
];

export default function Home() {
  // State management for the Sous.io app
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [ingredientsDatabase, setIngredientsDatabase] = useState<string[]>(INITIAL_INGREDIENTS);
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Load ingredients from API on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const response = await fetch('/api/ingredients');
        const result = await response.json();
        
        if (result.success && result.ingredients) {
          setIngredientsDatabase(result.ingredients);
        }
      } catch (error) {
        console.error('Failed to load ingredients from API:', error);
        // Keep using INITIAL_INGREDIENTS as fallback
      }
    };
    
    loadIngredients();
  }, []);

  // Effect for handling ingredient search and suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = ingredientsDatabase
        .filter(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedIngredients.includes(ingredient)
        )
        .slice(0, 8);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
      
      // Show "Add custom" option if no exact matches and search term is reasonable
      const exactMatch = ingredientsDatabase.some(ingredient => 
        ingredient.toLowerCase() === searchTerm.toLowerCase()
      );
      setShowAddCustom(!exactMatch && searchTerm.length > 2 && searchTerm.length < 30);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowAddCustom(false);
    }
  }, [searchTerm, selectedIngredients, ingredientsDatabase]);

  // Handler functions
  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
    setShowAddCustom(false);
    inputRef.current?.focus();
  };

  const addCustomIngredient = async (customIngredient: string) => {
    const normalizedIngredient = customIngredient.toLowerCase().trim();
    
    // Check if ingredient already exists (case-insensitive)
    const existingIngredient = ingredientsDatabase.find(
      ingredient => ingredient.toLowerCase() === normalizedIngredient
    );
    
    if (existingIngredient) {
      addIngredient(existingIngredient);
      return;
    }
    
    try {
      // Save to database via API
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: normalizedIngredient })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add to local database
        const newIngredientsDatabase = [...ingredientsDatabase, normalizedIngredient].sort();
        setIngredientsDatabase(newIngredientsDatabase);
        
        console.log(`Added new ingredient: ${normalizedIngredient}`);
      } else {
        console.error('Failed to save ingredient:', result.error);
        // Still add locally if it's just a file write error
        const newIngredientsDatabase = [...ingredientsDatabase, normalizedIngredient].sort();
        setIngredientsDatabase(newIngredientsDatabase);
      }
    } catch (error) {
      console.error('Failed to save ingredient to database:', error);
      // Still add to local state so user can continue
      const newIngredientsDatabase = [...ingredientsDatabase, normalizedIngredient].sort();
      setIngredientsDatabase(newIngredientsDatabase);
    }
    
    // Add to selected ingredients
    addIngredient(normalizedIngredient);
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const findRecipes = async () => {
    if (selectedIngredients.length === 0) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredRecipes = MOCK_RECIPES.filter(recipe => 
        selectedIngredients.some(ingredient => 
          recipe.ingredients.includes(ingredient)
        )
      );
      setRecipes(filteredRecipes);
      setIsSearching(false);
    }, 1500);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addIngredient(suggestions[0]);
      } else if (showAddCustom && searchTerm.trim()) {
        addCustomIngredient(searchTerm.trim());
      }
    }
  };

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <header className={`border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-bold">Sous.io</h1>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                What&apos;s in your fridge?
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add ingredients to discover amazing recipes you can make right now!
              </p>
            </div>

            {/* Ingredient Search */}
            <div className="relative max-w-md mx-auto mb-6">
              <div className={`relative flex items-center border rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-300 bg-white'
              } ${showSuggestions ? 'rounded-b-none' : ''}`}>
                <Search className={`w-5 h-5 ml-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search ingredients..."
                  className={`flex-1 px-3 py-3 bg-transparent outline-none placeholder-gray-500 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.length > 0 || showAddCustom) && (
                <div className={`absolute w-full border-x border-b rounded-b-lg z-10 max-h-60 overflow-y-auto ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}>
                  {/* Existing ingredients */}
                  {suggestions.map((ingredient, index) => (
                    <button
                      key={`suggestion-${index}`}
                      onClick={() => addIngredient(ingredient)}
                      className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-50 text-gray-800'
                      } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <Plus className="w-4 h-4 inline mr-2 text-green-500" />
                      {ingredient}
                    </button>
                  ))}
                  
                  {/* Add custom ingredient option */}
                  {showAddCustom && (
                    <button
                      onClick={() => addCustomIngredient(searchTerm.trim())}
                      className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-blue-400'
                          : 'hover:bg-gray-50 text-blue-600'
                      } ${suggestions.length > 0 ? `border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}` : ''}`}
                    >
                      <Plus className="w-4 h-4 inline mr-2 text-blue-500" />
                      Add &quot;{searchTerm}&quot; as new ingredient
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="max-w-4xl mx-auto mb-6">
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selected Ingredients ({selectedIngredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 text-gray-200 border border-gray-700'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className={`ml-2 rounded-full transition-colors duration-200 ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                        aria-label={`Remove ${ingredient}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Find Recipes Button */}
            <div className="text-center">
              <button
                onClick={findRecipes}
                disabled={selectedIngredients.length === 0 || isSearching}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedIngredients.length === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Finding Recipes...</span>
                  </div>
                ) : (
                  'Find Recipes'
                )}
              </button>
            </div>
          </section>

          {/* Results Section */}
          {recipes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                Recipes You Can Make ({recipes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">
                        {recipe.title}
                      </h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {recipe.description}
                      </p>
                      
                      <div className={`flex items-center space-x-4 text-sm mb-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.cookTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-orange-500">★</span>
                          <span>{recipe.rating}</span>
                        </div>
                      </div>

                      <button className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}>
                        View Recipe
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {recipes.length === 0 && selectedIngredients.length === 0 && (
            <section className="text-center py-12">
              <ChefHat className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Start by adding some ingredients
              </h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tell us what you have, and we&apos;ll find the perfect recipes for you
              </p>
            </section>
          )}
        </main>
      </div>
    </>
  );
}