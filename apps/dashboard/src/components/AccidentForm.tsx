import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Container,
  Heading,
  useToast,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Text,
  FormHelperText,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useCreateAccident, useUpdateAccident } from "../hooks/useAccidents";
import { AccidentCreate } from "../types/accident";
import { ChevronRightIcon } from "@chakra-ui/icons";

export interface AccidentFormProps {
  id?: number;
}

export function AccidentForm({ id }: AccidentFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccidentCreate>({
    defaultValues: {
      number_of_vehicles: 1,
      number_of_casualties: 0,
      speed_limit: 30,
    },
  });
  const createAccident = useCreateAccident();
  const updateAccident = useUpdateAccident();

  const onSubmit = async (data: AccidentCreate) => {
    try {
      if (id) {
        await updateAccident.mutateAsync({ id: Number(id), ...data });
        toast({
          title: "Accident updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createAccident.mutateAsync(data);
        toast({
          title: "Accident created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving accident",
        description:
          "Please try again or contact support if the problem persists",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate({ to: "/" })}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              {id ? "Edit Accident" : "New Accident"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="lg">{id ? "Edit Accident" : "New Accident"}</Heading>
        <Text color="gray.600">
          {id
            ? "Update the accident details below"
            : "Fill in the accident details below"}
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="sm"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <FormControl isInvalid={!!errors.date} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.time}>
              <FormLabel>Time</FormLabel>
              <Input
                type="time"
                {...register("time", {
                  setValueAs: (value) => value || null,
                })}
              />
              <FormHelperText>
                Optional - Leave empty if time is unknown
              </FormHelperText>
              <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.accident_severity} isRequired>
              <FormLabel>Severity</FormLabel>
              <Select
                {...register("accident_severity", {
                  required: "Severity is required",
                })}
              >
                <option value="">Select severity</option>
                <option value="1">Fatal</option>
                <option value="2">Serious</option>
                <option value="3">Slight</option>
              </Select>
              <FormErrorMessage>
                {errors.accident_severity?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.number_of_vehicles} isRequired>
              <FormLabel>Number of Vehicles</FormLabel>
              <NumberInput min={1} defaultValue={1}>
                <NumberInputField
                  {...register("number_of_vehicles", {
                    required: "Number of vehicles is required",
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>
                {errors.number_of_vehicles?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.number_of_casualties} isRequired>
              <FormLabel>Number of Casualties</FormLabel>
              <NumberInput min={0} defaultValue={0}>
                <NumberInputField
                  {...register("number_of_casualties", {
                    required: "Number of casualties is required",
                    min: { value: 0, message: "Must be at least 0" },
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>
                {errors.number_of_casualties?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.longitude} isRequired>
              <FormLabel>Longitude</FormLabel>
              <NumberInput step={0.0001} precision={4}>
                <NumberInputField
                  {...register("longitude", {
                    required: "Longitude is required",
                  })}
                  placeholder="Enter longitude"
                />
              </NumberInput>
              <FormHelperText>Format: -180.0000 to 180.0000</FormHelperText>
              <FormErrorMessage>{errors.longitude?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.latitude} isRequired>
              <FormLabel>Latitude</FormLabel>
              <NumberInput step={0.0001} precision={4}>
                <NumberInputField
                  {...register("latitude", {
                    required: "Latitude is required",
                  })}
                  placeholder="Enter latitude"
                />
              </NumberInput>
              <FormHelperText>Format: -90.0000 to 90.0000</FormHelperText>
              <FormErrorMessage>{errors.latitude?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.road_type} isRequired>
              <FormLabel>Road Type</FormLabel>
              <Select
                {...register("road_type", {
                  required: "Road type is required",
                })}
              >
                <option value="">Select road type</option>
                <option value="Single carriageway">Single carriageway</option>
                <option value="Dual carriageway">Dual carriageway</option>
                <option value="One way street">One way street</option>
              </Select>
              <FormErrorMessage>{errors.road_type?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.speed_limit} isRequired>
              <FormLabel>Speed Limit</FormLabel>
              <NumberInput min={0} defaultValue={30}>
                <NumberInputField
                  {...register("speed_limit", {
                    required: "Speed limit is required",
                    min: { value: 0, message: "Must be at least 0" },
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>In miles per hour (mph)</FormHelperText>
              <FormErrorMessage>{errors.speed_limit?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.weather_conditions} isRequired>
              <FormLabel>Weather Conditions</FormLabel>
              <Select
                {...register("weather_conditions", {
                  required: "Weather conditions are required",
                })}
              >
                <option value="">Select weather condition</option>
                <option value="Fine without high winds">
                  Fine without high winds
                </option>
                <option value="Raining without high winds">
                  Raining without high winds
                </option>
                <option value="Fog or mist">Fog or mist</option>
              </Select>
              <FormErrorMessage>
                {errors.weather_conditions?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.light_conditions} isRequired>
              <FormLabel>Light Conditions</FormLabel>
              <Select
                {...register("light_conditions", {
                  required: "Light conditions are required",
                })}
              >
                <option value="">Select light condition</option>
                <option value="Daylight: Street light present">
                  Daylight: Street light present
                </option>
                <option value="Darkness: Street lights present and lit">
                  Darkness: Street lights present and lit
                </option>
                <option value="Darkness: Street lighting unknown">
                  Darkness: Street lighting unknown
                </option>
              </Select>
              <FormErrorMessage>
                {errors.light_conditions?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Box display="flex" justifyContent="flex-end" gap={4}>
            <Button
              onClick={() => navigate({ to: "/" })}
              variant="outline"
              colorScheme="gray"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText={id ? "Updating..." : "Creating..."}
              leftIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
            >
              {id ? "Update Accident" : "Create Accident"}
            </Button>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
