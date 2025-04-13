import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { FaChartLine, FaMapMarkedAlt, FaShieldAlt } from "react-icons/fa";
import { ProtectedRoute } from "./ProtectedRoute";

export function LandingPage() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const featureBgColor = useColorModeValue("gray.50", "gray.700");

  const features = [
    {
      icon: FaChartLine,
      title: "Advanced Analytics",
      description: "Get detailed insights into accident patterns and trends",
    },
    {
      icon: FaMapMarkedAlt,
      title: "Interactive Maps",
      description:
        "Visualize accident locations with our interactive map interface",
    },
    {
      icon: FaShieldAlt,
      title: "Safety Insights",
      description: "Identify high-risk areas and improve road safety measures",
    },
  ];

  return (
    <ProtectedRoute requireAuth={false}>
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={20}>
          <VStack spacing={16} align="center">
            {/* Hero Section */}
            <VStack spacing={6} textAlign="center" maxW="3xl">
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
              >
                Accident Analysis Platform
              </Heading>
              <Text fontSize="xl" color={textColor}>
                Analyze, visualize, and understand road accident data to improve
                safety and prevent future incidents.
              </Text>
              <Flex gap={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={() => navigate({ to: "/auth/login" })}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: "/auth/signup" })}
                >
                  Sign Up
                </Button>
              </Flex>
            </VStack>

            {/* Features Section */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
              {features.map((feature, index) => (
                <VStack
                  key={index}
                  p={6}
                  bg={featureBgColor}
                  borderRadius="lg"
                  spacing={4}
                  align="start"
                >
                  <Icon as={feature.icon} w={8} h={8} color="blue.500" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={textColor}>{feature.description}</Text>
                </VStack>
              ))}
            </SimpleGrid>

            {/* Author Signature */}
            <Box w="full" textAlign="center" mt={8}>
              <Divider mb={4} />
              <Text fontSize="sm" color={textColor} fontStyle="italic">
                Authored by Dennis Lubanga
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
