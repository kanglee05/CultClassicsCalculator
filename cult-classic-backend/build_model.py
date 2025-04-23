# Module Imports
import bs4 as bs4
import numpy as np
import pandas as pd
import requests
import time as time
import tqdm as tqdm
import pickle
import kagglehub
from pathlib import Path
import torch
import torch.autograd as autograd
from torch import Tensor
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from transformers import BertForSequenceClassification, BertConfig, BertTokenizer
from torch.utils.data import DataLoader, Dataset
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import re

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(device)

# Download latest version of movie dataset
movie_path = kagglehub.dataset_download("asaniczka/tmdb-movies-dataset-2023-930k-movies")
print("Path to dataset files:", movie_path)

# Build the movies dataframe
cult_df = pd.read_csv(f"{movie_path}/TMDB_movie_dataset_v11.csv")
cult_df.head()

# Gets all the Wikipedia sublists for cult films
def build_list_urls():
  base = "https://en.wikipedia.org/wiki/List_of_cult_films:_"
  suffixes = ["0–9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
              "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
              "T", "U", "V", "W", "X", "Y","Z"]
  return [base+suffix for suffix in suffixes]

# Fetches a given page and returns its HTML in BeautifulSoup
def get_soup(url):
  res = requests.get(url)
  if (not res.ok):
    raise Exception("Something went wrong!")
  return bs4.BeautifulSoup(res.text)

# Takes a sublist page and returns all names within that page's table
def get_list_names(url):
  sp = get_soup(url)
  table_rows = sp.find_all("tr")[1:]
  movie_names = []
  for row in table_rows:
    movie_names.append(row.find('a').text)
  return movie_names

# Iterate through all the cult film pages and build an array of cult classics names
def build_cult_names():
  movie_lists = build_list_urls()
  cult_names = []
  for movie_list in movie_lists:
    cult_names = cult_names + get_list_names(movie_list)
  return cult_names

# Retrieves the cult names
# Picks
def get_cult_names(refresh=False):
    filename = "cc_names.txt"
    cc_file = Path(filename)

    if cc_file.is_file() and not refresh:
        with open(filename, "r", encoding="utf-8") as f:
            cult_names = [line.strip() for line in f if line.strip()]
    else:
        cult_names = build_cult_names()
        if not cult_names:
            raise Exception("Scraping failed — not saving an empty cult_names list.")
        with open(filename, "w", encoding="utf-8") as f:
            f.write("\n".join(cult_names))

    return cult_names

cult_names = get_cult_names()
cult_names = [name for name in cult_names if name.strip() != '']
# Add a column indicating whether a film is a cult film or not
mask = cult_df['title'].isin(cult_names)
cult_df['cult'] = mask.astype(int)
print("Cult classic count:", cult_df['cult'].sum())



# Drop all duplicates (really, this should be done earlier)
clean_df = cult_df.drop_duplicates(subset='title')
clean_df = clean_df.dropna(subset='title')

# Filter the cleaned dataframe by a set list of columns
cols = ['title','release_date', 'overview', 'runtime', 'revenue',
        'adult', 'budget', 'original_language', 'genres', 'tagline',
        'production_companies', 'keywords', 'cult']
clean_df = clean_df[cols]

# Do some minor data type correction
clean_df['release_date'] = pd.to_datetime(clean_df['release_date'])
clean_df['adult'] = clean_df['adult'].astype(int)

clean_df = clean_df[clean_df[['revenue', 'runtime', 'budget']].prod(axis=1) != 0]
clean_df = clean_df[clean_df['release_date'].notna()]
clean_df['production_companies'] = clean_df['production_companies'].fillna("Independent")

genre_list = clean_df['genres'].fillna('Genreless').str.split(", ").explode().unique()

# Lin Reg model
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, Binarizer
from sklearn.compose import make_column_transformer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn import tree
import matplotlib.pyplot as plt

features_df = clean_df.copy()

features_df['release_year'] = clean_df['release_date'].dt.year

# TODO: Add the one-hot-encodings of our keywords later
reg_cols = ['release_year', 'runtime', 'revenue', 'adult', 'budget']

for genre in genre_list:
  features_df[genre] = features_df['genres'].fillna('Genreless').str.contains(genre).astype(int)

features_df.head()
print(features_df['cult'].value_counts())
x_train, x_test, y_train, y_test = train_test_split(
    features_df[reg_cols + list(genre_list)],
    features_df['cult'],
    test_size=0.2,
    random_state=42,
    stratify=features_df['cult']
)

clf = tree.DecisionTreeClassifier(max_depth=4)
clf = clf.fit(x_train, y_train)

y_pred = clf.predict(x_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("F1 Score:", f1_score(y_test, y_pred))

filename = 'tree_model.sav'
pickle.dump(clf, open(filename, 'wb'))


