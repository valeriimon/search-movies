import { SearchRequest } from "@/models"
import { searchMovies } from "@/services/movie-service"
import { useQuery } from "@tanstack/react-query"

export function useSearchMovies(payload: SearchRequest) {
  return useQuery({
    queryKey: ['search-movies'],
    queryFn: () => searchMovies(payload)
  });
}