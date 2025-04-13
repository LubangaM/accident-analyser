import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  Link,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

interface LoginForm {
  email: string;
  password: string;
}

const MotionBox = motion(Box);

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { access_token } = await response.json();
      login(access_token);

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <Container maxW="container.md" py={10}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
          >
            {/* Left side - Image */}
            <Box
              flex="1"
              display={{ base: "none", md: "block" }}
              bgGradient="linear(to-br, blue.500, blue.600)"
              p={8}
              color="white"
            >
              <VStack h="full" justify="center" spacing={6}>
                <Image
                  src="/accident-analysis.png"
                  alt="Accident Analysis"
                  boxSize="200px"
                  objectFit="contain"
                />
                <VStack spacing={4} textAlign="center">
                  <Heading size="xl">Welcome Back</Heading>
                  <Text fontSize="lg">
                    Sign in to access your accident analysis dashboard
                  </Text>
                </VStack>
              </VStack>
            </Box>

            {/* Right side - Form */}
            <Box flex="1" p={8}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={2} textAlign="center">
                  <Heading size="xl" color="blue.500">
                    Sign In
                  </Heading>
                  <Text color="gray.600">
                    Enter your credentials to access your account
                  </Text>
                </VStack>

                <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        size="lg"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="Enter your email"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel>Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          placeholder="Enter your password"
                          focusBorderColor="blue.500"
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.password?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isSubmitting}
                      loadingText="Signing in..."
                    >
                      Sign In
                    </Button>

                    <HStack spacing={4} width="full">
                      <Divider />
                      <Text fontSize="sm" color="gray.500">
                        OR
                      </Text>
                      <Divider />
                    </HStack>

                    <Text textAlign="center">
                      Don't have an account?{" "}
                      <Link
                        color="blue.500"
                        fontWeight="bold"
                        onClick={() => navigate({ to: "/auth/signup" })}
                      >
                        Sign up
                      </Link>
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </MotionBox>
      </Container>
    </ProtectedRoute>
  );
}
