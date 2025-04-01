import pandas as pd
import numpy as np
from random import uniform as rnd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

# Load Dataset
df = pd.read_csv("inertiafit\backend\datasets\recipes.csv")

# Nutrition values used for food recommendations
nutrition_features = ['Calories', 'FatContent', 'SaturatedFatContent', 'CholesterolContent', 'SodiumContent', 
                      'CarbohydrateContent', 'FiberContent', 'SugarContent', 'ProteinContent']

# Person class for health calculations
class Person:
    def __init__(self, age, height, weight, gender, activity, meals_calories_perc, weight_loss):
        self.age = age
        self.height = height
        self.weight = weight
        self.gender = gender
        self.activity = activity
        self.meals_calories_perc = meals_calories_perc
        self.weight_loss = weight_loss

    def calculate_bmi(self):
        return round(self.weight / ((self.height / 100) ** 2), 2)

    def display_result(self):
        bmi = self.calculate_bmi()
        category = ('Underweight' if bmi < 18.5 else 'Normal' if bmi < 25 else 'Overweight' if bmi < 30 else 'Obesity')
        return bmi, category

    def calculate_bmr(self):
        return 10 * self.weight + 6.25 * self.height - 5 * self.age + (5 if self.gender == 'Male' else -161)

    def calories_calculator(self):
        activity_levels = ['Little/no exercise', 'Light exercise', 'Moderate exercise (3-5 days/wk)', 
                           'Very active (6-7 days/wk)', 'Extra active (very active & physical job)']
        weights = [1.2, 1.375, 1.55, 1.725, 1.9]
        return self.calculate_bmr() * weights[activity_levels.index(self.activity)]

    def generate_recommendations(self):
        total_calories = self.weight_loss * self.calories_calculator()
        recommendations = {}

        for meal, perc in self.meals_calories_perc.items():
            meal_calories = perc * total_calories
            recommendations[meal] = get_recommended_recipes(df, meal_calories)

        return recommendations

# ML Model for food recommendation using KNN
def get_recommended_recipes(df, meal_calories, top_n=3):
    df_filtered = df.dropna(subset=nutrition_features)
    X = df_filtered[nutrition_features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    knn = NearestNeighbors(n_neighbors=top_n, metric='cosine')
    knn.fit(X_scaled)
    
    target_nutrition = np.array([meal_calories, rnd(10, 40), rnd(0, 4), rnd(0, 30), rnd(0, 400), rnd(40, 75), rnd(4, 20), rnd(0, 10), rnd(30, 175)])
    target_scaled = scaler.transform([target_nutrition])
    
    distances, indices = knn.kneighbors(target_scaled)
    recommendations = df_filtered.iloc[indices[0]][['Name', 'Calories', 'RecipeIngredientParts', 'CookTime', 'PrepTime', 'TotalTime']]
    
    return recommendations.to_dict(orient='records')

# CLI Input
age = int(input("Enter your age: "))
height = int(input("Enter your height (cm): "))
weight = float(input("Enter your weight (kg): "))
gender = input("Enter your gender (Male/Female): ")

activity_levels = ['Little/no exercise', 'Light exercise', 'Moderate exercise (3-5 days/wk)', 'Very active (6-7 days/wk)', 'Extra active (very active & physical job)']
print("Select activity level:")
for i, level in enumerate(activity_levels, 1):
    print(f"{i}. {level}")

while True:
    try:
        choice = int(input("Enter choice (1-5): ").strip())
        if 1 <= choice <= 5:
            activity = activity_levels[choice - 1]
            break
        else:
            print("Invalid choice. Please enter a number between 1 and 5.")
    except ValueError:
        print("Invalid input. Please enter a numeric value.")

weight_loss_dict = {"Maintain": 1, "Mild Weight Loss": 0.9, "Weight Loss": 0.8, "Extreme Weight Loss": 0.6}
print("Select weight goal:")
for i, goal in enumerate(weight_loss_dict.keys(), 1):
    print(f"{i}. {goal}")

while True:
    try:
        choice = int(input("Enter choice (1-4): ").strip())
        if 1 <= choice <= 4:
            weight_loss = weight_loss_dict[list(weight_loss_dict.keys())[choice - 1]]
            break
        else:
            print("Invalid choice. Please enter a number between 1 and 4.")
    except ValueError:
        print("Invalid input. Please enter a numeric value.")

meals_calories_perc = {'breakfast': 0.30, 'lunch': 0.40, 'dinner': 0.30}

# Generate Recommendations
person = Person(age, height, weight, gender, activity, meals_calories_perc, weight_loss)
bmi, category = person.display_result()
print(f"\nYour BMI: {bmi} kg/m² - Category: {category}")
print(f"Maintenance Calories: {round(person.calories_calculator(), 2)} kcal/day")

recommendations = person.generate_recommendations()
for meal, recipes in recommendations.items():
    print(f"\nRecommended {meal.capitalize()} Recipes:")
    for recipe in recipes:
        print(f"- {recipe['Name']} ({recipe['Calories']} kcal)")
        print(f"  Ingredients: {recipe['RecipeIngredientParts'] if isinstance(recipe['RecipeIngredientParts'], str) else 'N/A'}")
        print(f"  Cook Time: {recipe.get('CookTime', 'N/A')} | Prep Time: {recipe.get('PrepTime', 'N/A')} | Total Time: {recipe.get('TotalTime', 'N/A')}")
