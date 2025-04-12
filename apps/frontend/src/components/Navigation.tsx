import { Link as RouterLink } from "@tanstack/react-router";
import { Box, Flex, Link, Button } from "@chakra-ui/react";

export const Navigation: React.FC = () => {
  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex maxW="1200px" mx="auto" justify="space-between" align="center">
        <Flex gap={4}>
          <Link
            as={RouterLink}
            to="/"
            color="white"
            _hover={{ textDecoration: "none", color: "blue.100" }}
          >
            Accidents
          </Link>
          <Link
            as={RouterLink}
            to="/analytics"
            color="white"
            _hover={{ textDecoration: "none", color: "blue.100" }}
          >
            Analytics
          </Link>
          <Link
            as={RouterLink}
            to="/upload"
            color="white"
            _hover={{ textDecoration: "none", color: "blue.100" }}
          >
            Upload
          </Link>
        </Flex>
        <Button
          as={RouterLink}
          to="/accidents/new"
          colorScheme="whiteAlpha"
          size="sm"
        >
          New Accident
        </Button>
      </Flex>
    </Box>
  );
};
