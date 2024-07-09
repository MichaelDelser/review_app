import pandas as pd
import numpy as np
from pymongo import MongoClient

def load_tsv_to_df(file_path, dtype=None, na_values='\\N'):
    print(f"Loading data from {file_path}...")
    df = pd.read_csv(file_path, sep='\t', na_values=na_values, dtype=dtype, low_memory=False)
    print(f"Loaded {len(df)} records from {file_path}.")
    return df

def preprocess_title_basics(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['isAdult'] = df['isAdult'].fillna(0).astype(int)
    df['startYear'] = pd.to_numeric(df['startYear'], errors='coerce').fillna(0).astype(int)
    df['endYear'] = pd.to_numeric(df['endYear'], errors='coerce').fillna(0).astype(int)
    df['runtimeMinutes'] = pd.to_numeric(df['runtimeMinutes'], errors='coerce').fillna(0).astype(int)
    df['genres'] = df['genres'].apply(lambda x: x.split(',') if pd.notna(x) else [])
    return df

def preprocess_name_basics(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['birthYear'] = pd.to_numeric(df['birthYear'], errors='coerce').fillna(0).astype(int)
    df['deathYear'] = pd.to_numeric(df['deathYear'], errors='coerce').fillna(0).astype(int)
    df['primaryProfession'] = df['primaryProfession'].apply(lambda x: x.split(',') if pd.notna(x) else [])
    df['knownForTitles'] = df['knownForTitles'].apply(lambda x: x.split(',') if pd.notna(x) else [])
    return df

def preprocess_title_episode(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['seasonNumber'] = pd.to_numeric(df['seasonNumber'], errors='coerce').fillna(0).astype(int)
    df['episodeNumber'] = pd.to_numeric(df['episodeNumber'], errors='coerce').fillna(0).astype(int)
    return df

def preprocess_title_crew(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['directors'] = df['directors'].apply(lambda x: x.split(',') if pd.notna(x) else [])
    df['writers'] = df['writers'].apply(lambda x: x.split(',') if pd.notna(x) else [])
    return df

def preprocess_title_principals(df):
    df.replace(r'\N', np.nan, inplace=True)
    return df

def preprocess_title_ratings(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['averageRating'] = pd.to_numeric(df['averageRating'], errors='coerce')
    df['numVotes'] = pd.to_numeric(df['numVotes'], errors='coerce')
    return df

def preprocess_title_akas(df):
    df.replace(r'\N', np.nan, inplace=True)
    df['ordering'] = pd.to_numeric(df['ordering'], errors='coerce').fillna(0).astype(int)
    df['isOriginalTitle'] = df['isOriginalTitle'].fillna(0).astype(int)
    return df

def insert_data_to_mongodb(df, collection_name, db):
    collection = db[collection_name]
    records = df.to_dict(orient='records')
    batch_size = 10000
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        collection.insert_many(batch)
        print(f"Inserted {i+len(batch)} records into {collection_name} collection.")

def main():
    client = MongoClient("mongodb://localhost:27017/")
    db = client['imdb']

    title_basics = load_tsv_to_df('title.basics.tsv')
    title_basics = preprocess_title_basics(title_basics)
    insert_data_to_mongodb(title_basics, "title_basics", db)

    name_basics = load_tsv_to_df('name.basics.tsv')
    name_basics = preprocess_name_basics(name_basics)
    insert_data_to_mongodb(name_basics, "name_basics", db)

    title_crew = load_tsv_to_df('title.crew.tsv')
    title_crew = preprocess_title_crew(title_crew)
    insert_data_to_mongodb(title_crew, "title_crew", db)

    title_episode = load_tsv_to_df('title.episode.tsv')
    title_episode = preprocess_title_episode(title_episode)
    insert_data_to_mongodb(title_episode, "title_episode", db)

    title_principals = load_tsv_to_df('title.principals.tsv')
    title_principals = preprocess_title_principals(title_principals)
    insert_data_to_mongodb(title_principals, "title_principals", db)

    title_ratings = load_tsv_to_df('title.ratings.tsv')
    title_ratings = preprocess_title_ratings(title_ratings)
    insert_data_to_mongodb(title_ratings, "title_ratings", db)

    title_akas = load_tsv_to_df('title.akas.tsv')
    title_akas = preprocess_title_akas(title_akas)
    insert_data_to_mongodb(title_akas, "title_akas", db)

    print("Data successfully inserted into MongoDB.")

if __name__ == "__main__":
    main()
