import { Movie, SearchRequest, SearchResponse } from "@/models";

const API_URL = 'http://localhost:8000/api/movies';

export async function searchMovies(payload: SearchRequest): Promise<SearchResponse<Movie>> {
  const url = new URL(`${API_URL}/search`);
  const params = new URLSearchParams();
  params.set('query', payload.query);
  params.set('page', String(payload.page));
  params.set('page_size', String(payload.page_size));
  url.search = params.toString();

  const res = await fetch(url.toString(), {
    method: 'GET'
  });

  return res.json();
}