import os
import numpy as np
import pandas as pd
from random import uniform as rnd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

# Load Dataset with Error Handling
try:
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to the backend directory
    backend_dir = os.path.dirname(current_dir)
    # Construct the path to recipes.csv
    file_path = os.path.join(backend_dir, "datasets", "recipes.csv")
    
    print(f"Attempting to load recipes from: {file_path}")
    df = pd.read_csv(file_path, encoding='utf-8', engine='python')
    print(f"Successfully loaded {len(df)} recipes")
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

# Nutrition values used for recommendations
nutrition_values = ['Calories', 'FatContent', 'SaturatedFatContent', 'CholesterolContent', 
                    'SodiumContent', 'CarbohydrateContent', 'FiberContent', 'SugarContent', 'ProteinContent']

# Class to generate food recommendations
class Recommendation:
    def __init__(self, nutrition_list, nb_recommendations, ingredient_txt):
        self.nutrition_list = nutrition_list
        self.nb_recommendations = nb_recommendations
        self.ingredient_txt = ingredient_txt

    def generate(self):
        df_filtered = df.dropna(subset=nutrition_values)
        X = df_filtered[nutrition_values]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        knn = NearestNeighbors(n_neighbors=self.nb_recommendations, metric='cosine')
        knn.fit(X_scaled)
        
        target_nutrition = np.array(self.nutrition_list)
        target_scaled = scaler.transform([target_nutrition])
        distances, indices = knn.kneighbors(target_scaled)
        
        results = df_filtered.iloc[indices[0]].copy()
        results['RecipeIngredientParts'] = results['RecipeIngredientParts'].apply(lambda x: ', '.join(eval(x)) if isinstance(x, str) and x.startswith('[') else x)
        return results[['Name', 'Calories', 'RecipeIngredientParts', 'CookTime', 'PrepTime', 'TotalTime']].to_dict(orient='records')

# Remove the CLI input section since we'll be using the API
