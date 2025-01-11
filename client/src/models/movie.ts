export interface Movie {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
  adult: boolean;
  vote_average: number;
  vote_count: number;
  release_date: string
  genres: string[];
}