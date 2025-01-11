import { Box, Card, chakra, Flex, Icon, Image, Text } from "@chakra-ui/react"
import { Movie } from "@/models"
import { GoStarFill } from "react-icons/go"
import React from "react";
import { Tag } from "../ui/tag";

type MovieCardProps = { movie: Movie }

const ForwardRefStarFill = chakra(React.forwardRef((props, _ref) => (
  <GoStarFill {...props} />
)));

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card.Root variant='elevated'>
      <Image
        src={movie.poster_path}
        alt={movie.title}
      />
      <Card.Body gap="2">
        <Card.Title>
          { movie.title }
        </Card.Title>
        <Card.Description mb="3">
          { movie.overview }
          
        </Card.Description>
        <Flex mt="auto" direction="column" spaceY="4">
          <Flex gap="2" wrap="wrap">
            {movie.genres.map(genre => (
              <Tag key={genre}>{ genre }</Tag>
            ))}
          </Flex>
          <Flex fontSize="sm" mt="auto" justify="space-between">
            <Box>{ movie.release_date }</Box>
            {!!movie.vote_count && (
              <Flex direction="column" alignItems="flex-end">
              <Flex alignItems="center" spaceX="1">
                <Icon fontSize="md" color="yellow.400">
                  <ForwardRefStarFill />
                </Icon>
                <Text>{ movie.vote_average.toFixed(1) } ({movie.vote_count})</Text> 
              </Flex>
            </Flex>
            )}
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}