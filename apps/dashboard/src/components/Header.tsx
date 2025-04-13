import {
  Box,
  Flex,
  Link,
  Button,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { FaGithub } from "react-icons/fa";

export function Header() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        py={4}
        align="center"
        justify="space-between"
      >
        <Flex gap={6} align="center">
          <RouterLink to="/" className="[&.active]:font-bold">
            Home
          </RouterLink>
          <RouterLink to="/accidents" className="[&.active]:font-bold">
            Accidents
          </RouterLink>
          <RouterLink to="/analytics" className="[&.active]:font-bold">
            Analytics
          </RouterLink>
          <RouterLink to="/accidents/new" className="[&.active]:font-bold">
            New Accident
          </RouterLink>
        </Flex>

        <Flex gap={4} align="center">
          <Link
            href="https://github.com/lubangam/accident-analyser"
            isExternal
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaGithub} />
            GitHub
          </Link>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => navigate({ to: "/auth/login" })}
          >
            Login
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate({ to: "/auth/signup" })}
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
