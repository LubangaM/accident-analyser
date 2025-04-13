import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  Avatar,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

interface ProfileForm {
  name: string;
}

export function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/v1/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ProtectedRoute>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          <HStack spacing={4} align="center">
            <Avatar size="xl" name={user?.name} />
            <Box>
              <Heading size="lg">{user?.name}</Heading>
              <Text color="gray.600">{user?.email}</Text>
            </Box>
          </HStack>

          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg={bgColor}
            p={8}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  size="lg"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  placeholder="Enter your name"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isSubmitting}
              >
                Update Profile
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </ProtectedRoute>
  );
}
