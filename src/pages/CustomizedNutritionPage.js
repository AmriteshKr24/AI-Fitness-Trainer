import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomizedNutritionPage = () => {
  // State for nutritional preferences
  const [nutritionPreferences, setNutritionPreferences] = useState({
    calories: 500,
    fat: 10,
    saturatedFat: 5,
    cholesterol: 50,
    sodium: 500,
    carbohydrate: 50,
    fiber: 10,
    sugar: 10,
    protein: 20
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  // Handle slider changes
  const handleSliderChange = (name, value) => {
    setNutritionPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/custom-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nutrition_values_list: [
            nutritionPreferences.calories,
            nutritionPreferences.fat,
            nutritionPreferences.saturatedFat,
            nutritionPreferences.cholesterol,
            nutritionPreferences.sodium,
            nutritionPreferences.carbohydrate,
            nutritionPreferences.fiber,
            nutritionPreferences.sugar,
            nutritionPreferences.protein
          ],
          nb_recommendations: 6,
          ingredient_txt: ''
        })
      });

      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('Unable to connect to the server. Please make sure the backend server is running on port 5000.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error('No recommendations found for the given nutritional values.');
      }
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to get recommendations. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-orange-500">
            Customized Food Recommendation System
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Enter your nutritional preferences to get customized food recommendations
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Calories */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Calories (kcal)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.calories}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                value={nutritionPreferences.calories}
                onChange={(e) => handleSliderChange('calories', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>2000</span>
              </div>
            </div>

            {/* Fat Content */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Fat Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.fat}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={nutritionPreferences.fat}
                onChange={(e) => handleSliderChange('fat', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            {/* Saturated Fat */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Saturated Fat Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.saturatedFat}</span>
              </div>
              <input
                type="range"
                min="0"
                max="13"
                value={nutritionPreferences.saturatedFat}
                onChange={(e) => handleSliderChange('saturatedFat', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>13</span>
              </div>
            </div>

            {/* Cholesterol */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Cholesterol Content (mg)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.cholesterol}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={nutritionPreferences.cholesterol}
                onChange={(e) => handleSliderChange('cholesterol', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>300</span>
              </div>
            </div>

            {/* Sodium */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Sodium Content (mg)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.sodium}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2300"
                value={nutritionPreferences.sodium}
                onChange={(e) => handleSliderChange('sodium', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>2300</span>
              </div>
            </div>

            {/* Carbohydrate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Carbohydrate Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.carbohydrate}</span>
              </div>
              <input
                type="range"
                min="0"
                max="325"
                value={nutritionPreferences.carbohydrate}
                onChange={(e) => handleSliderChange('carbohydrate', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>325</span>
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Fiber Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.fiber}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={nutritionPreferences.fiber}
                onChange={(e) => handleSliderChange('fiber', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>50</span>
              </div>
            </div>

            {/* Sugar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Sugar Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.sugar}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={nutritionPreferences.sugar}
                onChange={(e) => handleSliderChange('sugar', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>50</span>
              </div>
            </div>

            {/* Add Protein Content before the error message */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Protein Content (g)</label>
                <span className="text-orange-500 font-semibold">{nutritionPreferences.protein}</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={nutritionPreferences.protein}
                onChange={(e) => handleSliderChange('protein', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>40</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
                {error.includes('Unable to connect to the server') && (
                  <div className="mt-2 text-sm">
                    <p>To fix this:</p>
                    <ol className="list-decimal list-inside mt-1">
                      <li>Open a terminal</li>
                      <li>Navigate to the backend directory: <code className="bg-gray-800 px-2 py-1 rounded">cd inertiafit/backend</code></li>
                      <li>Start the Flask server: <code className="bg-gray-800 px-2 py-1 rounded">python app.py</code></li>
                      <li>Try generating recommendations again</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results section - Updated to display recipe details */}
        {recommendations && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Your Recommended Foods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((recipe, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">{index + 1}. {recipe.Name}</h3>
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {recipe.Calories} kcal
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Prep: {recipe.PrepTime} min | Cook: {recipe.CookTime} min | Total: {recipe.TotalTime} min</span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Ingredients:</h4>
                      <p className="text-sm text-gray-400">{recipe.RecipeIngredientParts}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomizedNutritionPage; 