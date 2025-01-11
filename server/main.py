from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from models import Movie, MovieModel, GenreModel, SearchResponse
from deps import SessionDep
from setup import setup_db_data

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_credentials=True,  # Allow cookies to be included
  allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
  allow_headers=["*"],
)

setup_db_data()

@app.get('/api/movies/search', response_model=SearchResponse)
def search(
    db: SessionDep,
    query: str = Query(''),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
  offset = (page - 1) * page_size
  movies_query = db.query(MovieModel).join(MovieModel.genres).filter(
    or_(
      MovieModel.title.ilike(f'%{query}%'),
      GenreModel.name.ilike(f'%{query}%')
    )
  ).distinct().order_by(MovieModel.release_date.desc())

  movies = movies_query.offset(offset).limit(page_size).all()
  total = movies_query.count()

  return SearchResponse[Movie](
    total=total,
    results=[map_movie_model_to_dto(movie) for movie in movies]
  )

def map_movie_model_to_dto(model: MovieModel) -> Movie:
  return Movie(
    id=model.id,
    title=model.title,
    overview=model.overview,
    adult=model.adult,
    genres=[genre.name for genre in model.genres],
    poster_path=model.poster_path,
    release_date=model.release_date,
    vote_average=model.vote_average,
    vote_count=model.vote_count
  )


