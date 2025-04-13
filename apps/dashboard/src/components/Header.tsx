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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Link as RouterLink,
  useNavigate,
  useMatches,
} from "@tanstack/react-router";
import { FaGithub, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const matches = useMatches();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("blue.500", "blue.300");

  // Get the current route path
  const currentPath = matches[matches.length - 1]?.pathname || "/";

  // Helper function to get route label
  const getRouteLabel = (path: string) => {
    switch (path) {
      case "/":
        return "Home";
      case "/accidents":
        return "Accidents";
      case "/accidents/new":
        return "New Accident";
      case "/accidents/upload":
        return "Upload CSV";
      case "/analytics":
        return "Analytics";
      case "/profile":
        return "Profile Settings";
      default:
        return path.split("/").pop() || "Home";
    }
  };

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
        direction="column"
        gap={4}
      >
        {/* Top Bar */}
        <Flex align="center" justify="space-between">
          <Flex gap={6} align="center">
            <RouterLink to="/" className="[&.active]:font-bold">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={currentPath === "/" ? activeColor : "inherit"}
              >
                Accident Analyzer
              </Text>
            </RouterLink>
            {isAuthenticated ? (
              <>
                <RouterLink to="/accidents" className="[&.active]:font-bold">
                  <Text
                    color={
                      currentPath.startsWith("/accidents")
                        ? activeColor
                        : "inherit"
                    }
                  >
                    Accidents
                  </Text>
                </RouterLink>
                <RouterLink to="/analytics" className="[&.active]:font-bold">
                  <Text
                    color={
                      currentPath === "/analytics" ? activeColor : "inherit"
                    }
                  >
                    Analytics
                  </Text>
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

        {/* Breadcrumb Navigation */}
        {isAuthenticated && currentPath !== "/" && (
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate({ to: "/" })}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentPath
              .split("/")
              .filter(Boolean)
              .map((segment, index, array) => {
                const path = `/${array.slice(0, index + 1).join("/")}`;
                const isLast = index === array.length - 1;
                return (
                  <BreadcrumbItem key={path} isCurrentPage={isLast}>
                    <BreadcrumbLink
                      onClick={() => !isLast && navigate({ to: path })}
                      color={isLast ? activeColor : "inherit"}
                      fontWeight={isLast ? "bold" : "normal"}
                    >
                      {getRouteLabel(path)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
          </Breadcrumb>
        )}
      </Flex>
    </Box>
  );
}
