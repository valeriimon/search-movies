import { Container, SimpleGrid, Flex, HStack, Spinner } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../ui/pagination";
import { MovieCard } from "./movie-card";
import { useAppContext } from "@/context/app-context";
import { useSearchMovies } from "@/queries/movie-query";
import { useState, useEffect } from "react";
import { replaceSearchParams } from "@/utils";
import { EmptyState } from "../ui/empty-state";
import { ImFileEmpty } from "react-icons/im";

export function MovieList() {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('page') || 1);
  const page_size = Number(params.get('page_size') || 10);

  const [pagination, updatePagination] = useState({ page, page_size, total: 0 });

  const { searchQuery, initial } = useAppContext();

  const { data, isFetching, isFetched, refetch } = useSearchMovies({
    query: searchQuery || '',
    page: pagination.page,
    page_size: pagination.page_size
  });

  // Update pagination total once BE fetch
  useEffect(() => {
    if (isFetched) {
      updatePagination(state => ({...state, total: data?.total || 0}));
    }
  }, [isFetching]);

  // Update query params and refetch on page change
  useEffect(() => {
    replaceSearchParams({
      query: !!searchQuery && searchQuery,
      page: !!pagination.page && String(pagination.page),
      page_size: !!pagination.page_size && String(pagination.page_size)
    });

    refetch();
  }, [pagination.page]);

  // If not initial app state, update query params and pagination
  useEffect(() => {
    if (initial) {
      return;
    }

    replaceSearchParams({
      query: !!searchQuery && searchQuery,
      page: '1',
      page_size: !!pagination.page_size && String(pagination.page_size)
    });

    updatePagination(state => ({...state, page: 1}));

    // If page is 1, trigger refetch, otherwise the refetch will happen in pagination effect
    if (pagination.page === 1) {
      refetch();
    }
  }, [searchQuery])

  return (
    <>
      {isFetching ? (
        <Flex width="100%" height="200px" justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Container mt="5" mb="5">
        {isFetched && data?.results.length ? (
          <>
            <Flex justify="flex-end" mb="5">
              <PaginationRoot count={pagination.total} pageSize={pagination.page_size} page={pagination.page} onPageChange={(e) => updatePagination((state) => ({...state, page: e.page}))}>
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Flex>
            <SimpleGrid
              columns={{ base: 1, md: 3, lg: 4 }}
              gap="16px"
            >
              {data?.results?.map(movie => (
                <MovieCard key={movie.id} movie={movie}></MovieCard>
              ))}
            </SimpleGrid>
            <Flex justify="center" mt="5">
              <PaginationRoot count={pagination.total} pageSize={pagination.page_size} page={pagination.page} onPageChange={(e) => updatePagination((state) => ({...state, page: e.page}))}>
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Flex>
          </>
        ) : (
          <EmptyState
            icon={<ImFileEmpty />}
            title="No movies found"
            description="More movies coming soon..."
          />
        )}
      </Container>
      )}
    </>
  )
}