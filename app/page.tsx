'use client';
import { useState } from 'react';
import { X, ChefHat } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [recipes, setRecipes] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipes = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setRecipes('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, dietary }),
      });

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error:', error);
      setRecipes('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateRecipes();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#5d7f6e]">
      {/* Header */}
      <header className="border-b border-[#e8ddd6] bg-[#faf9f7] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c8e6c9] to-[#f4b89c] flex items-center justify-center shadow-sm">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-light text-[#5d7f6e] tracking-tight">
              Sous
            </h1>
          </div>
          
          <button className="px-6 py-2.5 rounded-full bg-[#f4b89c] text-white font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-sm">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-light mb-4 text-[#5d7f6e] tracking-tight">
              What's in your kitchen?
            </h2>
            <p className="text-lg text-[#8b9b91] max-w-2xl mx-auto">
              Tell us what ingredients you have and discover delicious recipes you can make right now
            </p>
          </div>

          {/* Empty State */}
          {!recipes && !loading && (
            <div className="text-center py-12 mb-8">
              <div className="inline-flex p-8 rounded-full bg-[#c8e6c9]/30 mb-6">
                <ChefHat className="w-16 h-16 text-[#c8e6c9]" />
              </div>
              <h3 className="text-2xl font-light mb-3 text-[#5d7f6e]">
                Start by adding your ingredients
              </h3>
              <p className="text-base text-[#8b9b91] max-w-md mx-auto">
                We'll use AI to find the perfect recipes for you
              </p>
            </div>
          )}

          {/* Input Form */}
          <div className="bg-[#fff9f5] p-8 rounded-3xl shadow-sm mb-8 border border-[#e8ddd6]">
            {/* Ingredients Input */}
            <div className="mb-6">
              <label className="block text-[#5d7f6e] font-medium mb-3 text-sm uppercase tracking-wider">
                Your Ingredients
              </label>
              <div className="relative">
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., chicken, rice, tomatoes, garlic"
                  className="w-full p-4 pr-12 border border-[#e8ddd6] rounded-2xl focus:ring-2 focus:ring-[#c8e6c9] focus:border-transparent bg-[#fafbfa] placeholder-[#8b9b91] text-[#5d7f6e] transition-all duration-300"
                  rows={3}
                />
                {ingredients && (
                  <button
                    onClick={() => setIngredients('')}
                    className="absolute top-4 right-4 p-1.5 rounded-full transition-all duration-200 hover:bg-[#f4b89c]/20 text-[#8b9b91] hover:text-[#f4b89c]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Dietary Restrictions Input */}
            <div className="mb-6">
              <label className="block text-[#5d7f6e] font-medium mb-3 text-sm uppercase tracking-wider">
                Dietary Restrictions
                <span className="text-[#8b9b91] ml-2 text-xs normal-case">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., vegetarian, gluten-free, low-carb"
                  className="w-full p-4 pr-12 border border-[#e8ddd6] rounded-2xl focus:ring-2 focus:ring-[#c8e6c9] focus:border-transparent bg-[#fafbfa] placeholder-[#8b9b91] text-[#5d7f6e] transition-all duration-300"
                />
                {dietary && (
                  <button
                    onClick={() => setDietary('')}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-1.5 rounded-full transition-all duration-200 hover:bg-[#f4b89c]/20 text-[#8b9b91] hover:text-[#f4b89c]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={generateRecipes}
              disabled={loading || !ingredients.trim()}
              className="w-full bg-gradient-to-r from-[#c8e6c9] to-[#f4b89c] text-[#5d7f6e] font-semibold py-4 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-[#5d7f6e] border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Recipes...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <span>Generate Recipes</span>
                </div>
              )}
            </button>
            
            <p className="text-xs text-[#8b9b91] text-center mt-3">
              Tip: Press Ctrl+Enter to generate recipes
            </p>
          </div>
        </section>

        {/* Results Section */}
        {recipes && (
          <section className="bg-[#fff9f5] p-8 rounded-3xl shadow-sm border border-[#e8ddd6]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-light text-[#5d7f6e]">
                Your Recipes
              </h2>
              <button
                onClick={() => setRecipes('')}
                className="p-2 rounded-full transition-colors hover:bg-[#f0faf0] text-[#8b9b91]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-[#5d7f6e] leading-relaxed">
                {recipes}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#e8ddd6] flex gap-3">
              <button
                onClick={generateRecipes}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 bg-[#c8e6c9] text-[#5d7f6e] hover:opacity-85 hover:shadow-md disabled:opacity-50"
              >
                Generate Different Recipes
              </button>
              <button
                onClick={() => {
                  setRecipes('');
                  setIngredients('');
                  setDietary('');
                }}
                className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 border border-[#e8ddd6] text-[#5d7f6e] hover:bg-[#f0faf0]"
              >
                Start Over
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8ddd6] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-[#8b9b91]">
          <p>Powered by Google Gemini AI • Recipe Remix © 2024</p>
        </div>
      </footer>
    </div>
  );
}