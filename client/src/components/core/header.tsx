import { Container, Flex, Input } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { LuSearch } from "react-icons/lu";
import { useAppContext } from "@/context/app-context";
import debounce from "lodash.debounce";

export function Header() {
  const { searchQuery, updateSearchQuery } = useAppContext();

  const handleSearchChanged = debounce((value: string) => {
    updateSearchQuery(value);
  }, 1000);

  return (
    <Flex
        as="header" 
        bg="gray.900"
        paddingY="4"
        justify="center" 
        align="center"
      >
      <Container justifyContent="flex-end" display="flex">
        <InputGroup
          minW="320px"
          startElement={<LuSearch />}
        >
          <Input placeholder="Search movie name or genre..." defaultValue={searchQuery} onChange={(ev) => handleSearchChanged(ev.target.value)} />
        </InputGroup>
      </Container>
    </Flex>
  )
}