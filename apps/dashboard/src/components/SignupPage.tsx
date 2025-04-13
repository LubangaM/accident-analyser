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
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { ProtectedRoute } from "./ProtectedRoute";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const MotionBox = motion(Box);

export function SignupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const password = watch("password");

  const onSubmit = async (data: SignupForm) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed");
      }

      await response.json();
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support",
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
                  <Heading size="xl">Join Us</Heading>
                  <Text fontSize="lg">
                    Create an account to start analyzing accident data
                  </Text>
                </VStack>
              </VStack>
            </Box>

            {/* Right side - Form */}
            <Box flex="1" p={8}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={2} textAlign="center">
                  <Heading size="xl" color="blue.500">
                    Create Account
                  </Heading>
                  <Text color="gray.600">
                    Fill in your details to get started
                  </Text>
                </VStack>

                <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.name}>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        size="lg"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        placeholder="Enter your full name"
                        focusBorderColor="blue.500"
                      />
                      <FormErrorMessage>
                        {errors.name?.message}
                      </FormErrorMessage>
                    </FormControl>

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

                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                          placeholder="Confirm your password"
                          focusBorderColor="blue.500"
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            icon={
                              showConfirmPassword ? (
                                <ViewOffIcon />
                              ) : (
                                <ViewIcon />
                              )
                            }
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.confirmPassword?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isSubmitting}
                      loadingText="Creating account..."
                    >
                      Create Account
                    </Button>

                    <HStack spacing={4} width="full">
                      <Divider />
                      <Text fontSize="sm" color="gray.500">
                        OR
                      </Text>
                      <Divider />
                    </HStack>

                    <Text textAlign="center">
                      Already have an account?{" "}
                      <Link
                        color="blue.500"
                        fontWeight="bold"
                        onClick={() => navigate({ to: "/auth/login" })}
                      >
                        Sign in
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
