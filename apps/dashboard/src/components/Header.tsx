import {
  Box,
  Flex,
  Link,
  Button,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { FaGithub, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
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
          {isAuthenticated ? (
            <>
              <RouterLink to="/accidents" className="[&.active]:font-bold">
                Accidents
              </RouterLink>
              <RouterLink to="/analytics" className="[&.active]:font-bold">
                Analytics
              </RouterLink>
              <RouterLink to="/accidents/new" className="[&.active]:font-bold">
                New Accident
              </RouterLink>
              <RouterLink
                to="/accidents/upload"
                className="[&.active]:font-bold"
              >
                Upload CSV
              </RouterLink>
            </>
          ) : null}
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
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={<Avatar size="sm" name={user?.name} />}
                rightIcon={<Icon as={FaUser} />}
              >
                <HStack spacing={2}>
                  <Text>{user?.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<Icon as={FaCog} />}
                  onClick={() => navigate({ to: "/profile" })}
                >
                  Profile Settings
                </MenuItem>
                <MenuItem
                  icon={<Icon as={FaSignOutAlt} />}
                  onClick={logout}
                  color="red.500"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
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
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
