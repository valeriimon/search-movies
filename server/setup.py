from models import GenreModel, MovieModel, DBStateModel
from db import SessionLocal
from sqlalchemy.orm import Session
from os import getenv
import requests


MOVIE_API_BASE = "https://api.themoviedb.org/3/movie/popular"
GENRES_API_BASE = 'https://api.themoviedb.org/3/genre/movie/list'
IMAGES_API_BASE = 'https://image.tmdb.org/t/p/w220_and_h330_face'

TMDB_API_KEY = getenv('TMDB_API_KEY')

default_params = {
  'api_key': TMDB_API_KEY,
  'language': 'en-US'
}

headers = {"accept": "application/json"}

MAX_MOVIES_PAGES = 10

def setup_db_data():
  db = SessionLocal()
  try:
    db_state = db.query(DBStateModel).first()
    if db_state is None:
      db_state = DBStateModel(setup_complete=False)
      db.add(db_state)
    elif db_state.setup_complete:
      print('Database already populated')
      return

    populate_movie_genres(db)
    for page in range(1, MAX_MOVIES_PAGES + 1):
      populate_movies(db, page)

    db_state.setup_complete = True
    db.commit()
  except RuntimeError as ex:
    db.rollback()
    print(f'Error setting up database: {ex}')
  finally:
    db.close()

def populate_movies(db: Session, page = 1):
  print('Populating movies from TMDB..')
  data = http_get_movies(page)
  for movie in data['results']:
    db_movie = create_movie_model(movie)
    db_movie.poster_path = f'{IMAGES_API_BASE}{movie.get("poster_path")}'
    db.add(db_movie)
    map_genres(movie.get('genre_ids'), db_movie, db)

  db.commit()

def populate_movie_genres(db: Session):
  print('Populating genres from TMDB..')
  data = http_get_movie_genres()
  for genre in data['genres']:
    db_genre = GenreModel(name=genre.get('name'), original_id=genre.get('id'))
    db.add(db_genre)

  db.commit()


def http_get_movies(page: int = 1):
  response = requests.get(
    url=MOVIE_API_BASE,
    headers=headers,
    params={
      'page': page,
      **default_params
    }
  )

  if response.status_code != 200:
    raise RuntimeError('Error getting movie genres')
  
  return response.json()

def http_get_movie_genres():
  response = requests.get(
    url=GENRES_API_BASE,
    headers=headers,
    params=default_params
  )

  if response.status_code != 200:
    raise RuntimeError('Error getting movie genres')
  
  return response.json()

def create_movie_model(data) -> MovieModel:
  return MovieModel(
    poster_path=data.get('poster_path'),
    title=data.get('title'),
    overview=data.get('overview'),
    adult=data.get('adult'),
    vote_average=data.get('vote_average'),
    vote_count=data.get('vote_count'),
    release_date=data.get('release_date'),
  )

def map_genres(genres: list[int], movie: MovieModel, db: Session):
  for genre_id in genres:
    genre = db.query(GenreModel).filter_by(original_id=genre_id).first()
    if genre:
      movie.genres.append(genre)
