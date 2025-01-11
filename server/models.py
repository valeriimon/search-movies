from db import Base, engine
from pydantic import BaseModel
from typing import List, Generic, TypeVar
from sqlalchemy import Column, Boolean, String, Integer, Table, ForeignKey, Float
from sqlalchemy.orm import relationship

class DBStateModel(Base):
  __tablename__='db_state'

  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  setup_complete = Column(Boolean, default=False)

class MovieModel(Base):
  __tablename__='movies'

  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  poster_path = Column(String)
  title = Column(String)
  overview = Column(String)
  adult = Column(Boolean)
  vote_average = Column(Float)
  vote_count = Column(Integer)
  release_date = Column(String)

  genres = relationship('GenreModel', secondary='movie_genre_association', back_populates='movies')

class GenreModel(Base):
  __tablename__='genres'

  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  original_id = Column(Integer)
  name = Column(String)

  movies = relationship('MovieModel', secondary="movie_genre_association", back_populates='genres')

movie_genre_association = Table(
    "movie_genre_association",
    Base.metadata,
    Column('movie_id', Integer, ForeignKey('movies.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)

class Genre(BaseModel):
  id: int
  original_id: int
  name: str

class Movie(BaseModel):
  id: int
  poster_path: str
  title: str
  overview: str
  adult: bool
  vote_average: float
  vote_count: int
  release_date: str
  genres: List[str]

SearchResponseResultType = TypeVar('T')
class SearchResponse(BaseModel, Generic[SearchResponseResultType]):
  total: int
  results: List[SearchResponseResultType]


Base.metadata.create_all(bind=engine)