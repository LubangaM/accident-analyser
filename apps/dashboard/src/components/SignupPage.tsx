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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const password = watch("password");

  const onSubmit = async (data: SignupForm) => {
    try {
      // TODO: Implement actual signup logic
      console.log("Signup data:", data);
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate({ to: "/analytics" });
    } catch (error) {
      console.error("Signup error:", error);

      toast({
        title: "Signup failed",
        description: "Please try again or contact support",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={2} textAlign="center">
          <Heading size="xl">Create Account</Heading>
          <Text color="gray.600">Sign up to start analyzing accident data</Text>
        </VStack>

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="sm"
        >
          <VStack spacing={6}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Enter your full name"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Confirm your password"
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>

            <Text textAlign="center">
              Already have an account?{" "}
              <Link
                color="blue.500"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
