from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from random import uniform as rnd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import os
from python.customized_recommendation_system import Recommendation

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Dataset with better error handling
print("\n===== LOADING RECIPE DATASET =====")
df = None
try:
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct paths relative to the current directory
    possible_paths = [
        os.path.join(current_dir, "datasets", "recipes.csv"),
        os.path.join(current_dir, "..", "datasets", "recipes.csv"),
        os.path.join(current_dir, "..", "..", "datasets", "recipes.csv")
    ]
    
    for path in possible_paths:
        try:
            print(f"Attempting to load recipes from: {path}")
            df = pd.read_csv(path)
            print(f"Successfully loaded {len(df)} recipes from {path}")
            break
        except FileNotFoundError:
            print(f"File not found at {path}")
        except Exception as e:
            print(f"Error loading {path}: {str(e)}")
    
    if df is None:
        raise FileNotFoundError("Could not find recipes.csv in any of the expected locations")
    
    # Check loaded data
    print(f"Dataset shape: {df.shape}")
    print(f"Dataset columns: {df.columns.tolist()}")
    
except Exception as e:
    print(f"Error loading dataset: {str(e)}")
    # Create an empty DataFrame with required columns
    print("Creating empty DataFrame as fallback")
    df = pd.DataFrame(columns=['Name', 'Calories', 'FatContent', 'SaturatedFatContent', 'CholesterolContent', 'SodiumContent', 
                              'CarbohydrateContent', 'FiberContent', 'SugarContent', 'ProteinContent',
                              'RecipeIngredientParts', 'CookTime', 'PrepTime', 'TotalTime'])

# Nutrition values used for food recommendations
nutrition_features = ['Calories', 'FatContent', 'SaturatedFatContent', 'CholesterolContent', 'SodiumContent', 
                      'CarbohydrateContent', 'FiberContent', 'SugarContent', 'ProteinContent']

# Check if the dataset has all required features
missing_features = [feature for feature in nutrition_features if feature not in df.columns]
if missing_features:
    print(f"Warning: Dataset is missing the following features: {missing_features}")
    for feature in missing_features:
        df[feature] = 0  # Add missing columns with zeros

# Person class for health calculations
class Person:
    def __init__(self, age, height, weight, gender, activity, weight_goal):
        self.age = age
        self.height = height
        self.weight = weight
        self.gender = gender
        self.activity = activity
        self.weight_goal = weight_goal
        self.meals_calories_perc = {'breakfast': 0.30, 'lunch': 0.40, 'dinner': 0.30}
        
        # Map weight goals to multipliers
        self.weight_loss_map = {
            "Lose": 0.8,       # Weight loss
            "Maintain": 1.0,    # Maintain weight
            "Gain": 1.2        # Weight gain
        }
        self.weight_loss = self.weight_loss_map.get(weight_goal, 1.0)
        print(f"\nInitialized Person: age={age}, height={height}cm, weight={weight}kg, gender={gender}")
        print(f"Goal: {weight_goal} (multiplier: {self.weight_loss})")

    def calculate_bmi(self):
        bmi = round(self.weight / ((self.height / 100) ** 2), 2)
        print(f"BMI Calculation: {self.weight} / ({self.height/100})² = {bmi}")
        return bmi

    def display_result(self):
        bmi = self.calculate_bmi()
        category = ('Underweight' if bmi < 18.5 else 'Normal weight' if bmi < 25 else 'Overweight' if bmi < 30 else 'Obesity')
        print(f"BMI Category: {bmi} kg/m² -> {category}")
        return bmi, category

    def calculate_bmr(self):
        # Mifflin-St Jeor Equation
        bmr = 10 * self.weight + 6.25 * self.height - 5 * self.age + (5 if self.gender == 'Male' else -161)
        print(f"BMR Calculation: 10*{self.weight} + 6.25*{self.height} - 5*{self.age} + {5 if self.gender == 'Male' else -161} = {bmr}")
        return bmr

    def calories_calculator(self):
        activity_levels = ['Little/no exercise', 'Light exercise', 'Moderate exercise', 'Heavy exercise', 'Very heavy exercise']
        weights = [1.2, 1.375, 1.55, 1.725, 1.9]
        
        # Find the most similar activity level if not an exact match
        activity_index = 0
        for i, level in enumerate(activity_levels):
            if level.lower() in self.activity.lower():
                activity_index = i
                break
        
        bmr = self.calculate_bmr()
        tdee = bmr * weights[activity_index]
        print(f"TDEE Calculation: {bmr} * {weights[activity_index]} (activity multiplier) = {tdee}")
        return tdee

    def calculate_macros(self):
        tdee = self.calories_calculator()
        total_calories = round(self.weight_loss * tdee)
        print(f"Adjusted Calories: {tdee} * {self.weight_loss} (goal multiplier) = {total_calories}")
        
        # Calculate macronutrients based on weight goal
        if self.weight_goal == "Lose":
            protein_g = round(self.weight * 1.6)  # Higher protein for weight loss
            fat_g = round(self.weight * 0.5)     # Lower fat for weight loss
            carbs_g = round((total_calories - (protein_g * 4 + fat_g * 9)) / 4)  # Remaining calories from carbs
        elif self.weight_goal == "Gain":
            protein_g = round(self.weight * 2.2)  # Higher protein for muscle gain
            fat_g = round(self.weight * 1.0)     # Moderate fat for weight gain
            carbs_g = round((total_calories - (protein_g * 4 + fat_g * 9)) / 4)  # Remaining calories from carbs
        else:  # Maintain
            protein_g = round(self.weight * 1.2)  # Moderate protein for maintenance
            fat_g = round(self.weight * 0.8)     # Moderate fat for maintenance
            carbs_g = round((total_calories - (protein_g * 4 + fat_g * 9)) / 4)  # Remaining calories from carbs
        
        print(f"Macros: Protein={protein_g}g, Carbs={carbs_g}g, Fats={fat_g}g")
        print(f"Calorie breakdown: Protein={protein_g*4}kcal, Carbs={carbs_g*4}kcal, Fats={fat_g*9}kcal, Total={protein_g*4 + carbs_g*4 + fat_g*9}kcal")
        
        return {
            "calories": total_calories,
            "protein": protein_g,
            "carbs": carbs_g,
            "fats": fat_g
        }

    def generate_recommendations(self):
        bmi, category = self.display_result()
        macros = self.calculate_macros()
        
        # Generate ML-based recipe recommendations
        print("\n===== GENERATING ML-BASED RECIPE RECOMMENDATIONS =====")
        try:
            # Calculate calories for each meal based on distribution
            breakfast_calories = round(macros["calories"] * 0.3)
            lunch_calories = round(macros["calories"] * 0.4)
            dinner_calories = round(macros["calories"] * 0.3)
            
            print(f"Breakfast target calories: {breakfast_calories}")
            print(f"Lunch target calories: {lunch_calories}")
            print(f"Dinner target calories: {dinner_calories}")
            
            # Get recipe recommendations using KNN algorithm
            breakfast_recipes = get_recommended_recipes(df, breakfast_calories, top_n=3)
            lunch_recipes = get_recommended_recipes(df, lunch_calories, top_n=3)
            dinner_recipes = get_recommended_recipes(df, dinner_calories, top_n=3)
            
            print(f"ML recommended breakfast recipes: {[recipe['Name'] for recipe in breakfast_recipes]}")
            print(f"ML recommended lunch recipes: {[recipe['Name'] for recipe in lunch_recipes]}")
            print(f"ML recommended dinner recipes: {[recipe['Name'] for recipe in dinner_recipes]}")
            
            # Add ML recipe recommendations to response
            recipe_recommendations = {
                "breakfast": breakfast_recipes,
                "lunch": lunch_recipes,
                "dinner": dinner_recipes
            }
        except Exception as e:
            print(f"Error generating ML recipe recommendations: {str(e)}")
            recipe_recommendations = {
                "breakfast": [],
                "lunch": [],
                "dinner": []
            }
        
        return {
            "bmi": str(bmi),
            "category": category,
            "calories": macros["calories"],
            "protein": macros["protein"],
            "carbs": macros["carbs"],
            "fats": macros["fats"],
            "recipes": recipe_recommendations
        }

# ML Model for food recommendation using KNN (not used directly in the API yet, but can be integrated)
def get_recommended_recipes(df, meal_calories, top_n=3):
    print(f"Starting recipe recommendation for {meal_calories} calories")
    try:
        # Filter the DataFrame to handle potential NaN values
        df_filtered = df.dropna(subset=nutrition_features)
        print(f"Filtered dataset size: {len(df_filtered)} recipes")
        
        # Extract nutrition features
        X = df_filtered[nutrition_features]
        
        # Normalize the data
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train KNN model
        print("Training KNN model...")
        knn = NearestNeighbors(n_neighbors=top_n, metric='cosine')
        knn.fit(X_scaled)
        
        # Generate target nutrition profile based on meal calories
        protein_target = rnd(meal_calories * 0.25 / 4, meal_calories * 0.35 / 4)  # 25-35% of calories from protein
        carbs_target = rnd(meal_calories * 0.45 / 4, meal_calories * 0.65 / 4)    # 45-65% of calories from carbs
        fat_target = rnd(meal_calories * 0.2 / 9, meal_calories * 0.35 / 9)      # 20-35% of calories from fat
        
        # Convert macros to approximations of other nutrition values
        target_nutrition = np.array([
            meal_calories,                          # Calories
            fat_target,                             # FatContent (g)
            fat_target * 0.3,                       # SaturatedFatContent (g) - ~30% of fat
            protein_target * 3,                     # CholesterolContent (mg) - rough approximation
            meal_calories * 0.2,                    # SodiumContent (mg) - rough approximation
            carbs_target,                           # CarbohydrateContent (g)
            carbs_target * 0.15,                    # FiberContent (g) - ~15% of carbs
            carbs_target * 0.2,                     # SugarContent (g) - ~20% of carbs
            protein_target                          # ProteinContent (g)
        ])
        
        print(f"Target nutrition profile: Protein={protein_target}g, Carbs={carbs_target}g, Fat={fat_target}g")
        
        # Scale the target nutrition values
        target_scaled = scaler.transform([target_nutrition])
        
        # Find nearest neighbors
        distances, indices = knn.kneighbors(target_scaled)
        
        # Get recommended recipes
        recommendations = df_filtered.iloc[indices[0]][['Name', 'Calories', 'RecipeIngredientParts', 'CookTime', 'PrepTime', 'TotalTime']]
        
        # Convert to dictionary format
        result = recommendations.to_dict(orient='records')
        print(f"Found {len(result)} recipe recommendations")
        return result
    
    except Exception as e:
        print(f"Error in get_recommended_recipes: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        
        # Return empty list in case of error
        return []

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Welcome to InertiaFit Personalized Food Recommendation System API",
        "endpoints": {
            "/api/health": "Health check endpoint",
            "/api/nutrition": "POST endpoint for nutrition recommendations",
            "/api/custom-nutrition": "POST endpoint for custom nutrition recommendations"
        }
    })

@app.route('/api/nutrition', methods=['POST'])
def nutrition_recommendation():
    data = request.json
    
    # Print received data from frontend
    print("\n===== RECEIVED NUTRITION REQUEST =====")
    print(f"Age: {data.get('age', 30)}")
    print(f"Height: {data.get('height', 170)} cm")
    print(f"Weight: {data.get('weight', 70)} kg")
    print(f"Gender: {data.get('gender', 'Male')}")
    print(f"Activity Level: {data.get('activityLevel', 'Little/no exercise')}")
    print(f"Weight Goal: {data.get('weightGoal', 'Maintain')}")
    
    # Extract data from the request
    age = int(data.get('age', 30))
    height = int(data.get('height', 170))
    weight = float(data.get('weight', 70))
    gender = data.get('gender', 'Male')
    activity_level = data.get('activityLevel', 'Little/no exercise')
    weight_goal = data.get('weightGoal', 'Maintain')
    
    # Create Person object and generate recommendations
    person = Person(age, height, weight, gender, activity_level, weight_goal)
    recommendations = person.generate_recommendations()
    
    # Print calculated recommendations
    print("\n===== NUTRITION RECOMMENDATIONS GENERATED =====")
    print(f"BMI: {recommendations['bmi']} - Category: {recommendations['category']}")
    print(f"Calories: {recommendations['calories']} kcal")
    print(f"Protein: {recommendations['protein']} g")
    print(f"Carbs: {recommendations['carbs']} g")
    print(f"Fats: {recommendations['fats']} g")
    print(f"Meal Plan: Breakfast: {recommendations['recipes']['breakfast'][0]['Name'][:30]}...")
    print("===== END OF RECOMMENDATIONS =====\n")
    
    return jsonify(recommendations)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "up", "message": "Flask API is running"})

@app.route('/api/custom-nutrition', methods=['POST'])
def get_custom_recommendations():
    try:
        data = request.get_json()
        nutrition_values_list = data.get('nutrition_values_list')
        nb_recommendations = data.get('nb_recommendations', 6)
        ingredient_txt = data.get('ingredient_txt', '')

        if not nutrition_values_list or len(nutrition_values_list) != 9:
            return jsonify({'error': 'Invalid nutrition values provided'}), 400

        recommendation = Recommendation(nutrition_values_list, nb_recommendations, ingredient_txt)
        recommendations = recommendation.generate()

        if not recommendations:
            return jsonify({'error': 'No recommendations found for the given nutritional values'}), 404

        return jsonify(recommendations)
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({'error': 'Failed to generate recommendations'}), 500

if __name__ == '__main__':
    print("\n===== STARTING FLASK SERVER =====")
    print(f"Flask API is running at http://localhost:5000")
    print("Available endpoints:")
    print("  GET  /api/health - Health check")
    print("  POST /api/nutrition - Nutrition recommendations")
    print("  POST /api/custom-nutrition - Custom nutrition recommendations")
    print("  GET  / - API information")
    print("\nPress Ctrl+C to stop the server")
    print("=====================================\n")
    app.run(debug=True, port=5000) 