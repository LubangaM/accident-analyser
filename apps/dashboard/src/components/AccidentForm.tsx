import React from "react";
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
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Tooltip,
  Stepper,
  Step,
  StepDescription,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  useCreateAccident,
  useUpdateAccident,
  useAccident,
} from "../hooks/useAccidents";
import { AccidentCreate } from "../types/accident";
import { ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { format } from "date-fns";

export interface AccidentFormProps {
  accidentId?: number | string;
}

type StepFields = {
  [key: number]: (keyof AccidentCreate)[];
};

export function AccidentForm({ accidentId }: AccidentFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const { data: existingAccident, isLoading: isLoadingAccident } = useAccident(
    accidentId ? Number(accidentId) : 0
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<AccidentCreate>({
    defaultValues: {
      number_of_vehicles: 1,
      number_of_casualties: 0,
      speed_limit: 30,
    },
  });

  // Reset form with existing accident data when it's loaded
  React.useEffect(() => {
    if (existingAccident) {
      reset({
        ...existingAccident,
        date: format(new Date(existingAccident.date), "yyyy-MM-dd"),
      });
    }
  }, [existingAccident, reset]);

  const createAccident = useCreateAccident();
  const updateAccident = useUpdateAccident();

  const onSubmit = async (data: AccidentCreate) => {
    try {
      if (accidentId) {
        await updateAccident.mutateAsync({
          id: Number(accidentId),
          ...data,
        });
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
      navigate({ to: "/accidents" });
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

  const severity = watch("accident_severity");

  const steps = [
    { title: "Basic Info", description: "Date, time, and severity" },
    { title: "Location", description: "Coordinates and road details" },
    { title: "Conditions", description: "Weather and lighting" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const stepFields: StepFields = {
    0: [
      "date",
      "accident_severity",
      "number_of_vehicles",
      "number_of_casualties",
    ],
    1: ["longitude", "latitude", "road_type", "speed_limit"],
    2: ["weather_conditions", "light_conditions"],
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const currentFields = stepFields[activeStep];
    if (!currentFields) return;

    const hasErrors = currentFields.some((field) => errors[field]);
    const isTouched = currentFields.some((field) => watch(field));

    if (hasErrors || !isTouched) {
      toast({
        title: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveStep(Math.min(activeStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setActiveStep(Math.max(activeStep - 1, 0));
  };

  const handleSubmitClick = () => {
    // Validate all fields before submission
    const allFields = Object.values(
      stepFields
    ).flat() as (keyof AccidentCreate)[];
    const hasErrors = allFields.some((field) => errors[field]);
    const isTouched = allFields.some((field) => watch(field));

    if (hasErrors || !isTouched) {
      toast({
        title: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    handleSubmit(onSubmit)();
  };

  if (isLoadingAccident && accidentId) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate({ to: "/accidents" })}>
              Accidents
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              {accidentId ? "Edit Accident" : "New Accident"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading size="lg">
          {accidentId ? "Edit Accident" : "New Accident"}
        </Heading>
        <Text color="gray.600">
          {accidentId
            ? "Update the accident details below"
            : "Fill in the accident details below"}
        </Text>

        {severity === "1" && (
          <Alert status="error" variant="subtle">
            <AlertIcon />
            <Box>
              <AlertTitle>Fatal Accident</AlertTitle>
              <AlertDescription>
                This accident resulted in fatalities. Please ensure all details
                are accurate.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Stepper index={activeStep} mb={8}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepNumber />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
              <FormControl isInvalid={!!errors.date} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Date</Text>
                  <Tooltip label="Date when the accident occurred">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
                <Input
                  type="date"
                  max={format(new Date(), "yyyy-MM-dd")}
                  {...register("date", { required: "Date is required" })}
                />
                <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.time}>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Time</Text>
                  <Tooltip label="Time when the accident occurred (24-hour format)">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Severity</Text>
                  <Tooltip label="Severity of the accident (Fatal, Serious, or Slight)">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Number of Vehicles</Text>
                  <Tooltip label="Total number of vehicles involved in the accident">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Number of Casualties</Text>
                  <Tooltip label="Total number of people injured or killed in the accident">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
            </SimpleGrid>
          )}

          {activeStep === 1 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
              <FormControl isInvalid={!!errors.longitude} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Longitude</Text>
                  <Tooltip label="Geographic coordinate (e.g., -0.1276)">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
                <NumberInput step={0.0001} precision={4}>
                  <NumberInputField
                    {...register("longitude", {
                      required: "Longitude is required",
                      min: {
                        value: -180,
                        message: "Must be between -180 and 180",
                      },
                      max: {
                        value: 180,
                        message: "Must be between -180 and 180",
                      },
                    })}
                    placeholder="Enter longitude"
                  />
                </NumberInput>
                <FormHelperText>Format: -180.0000 to 180.0000</FormHelperText>
                <FormErrorMessage>{errors.longitude?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.latitude} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Latitude</Text>
                  <Tooltip label="Geographic coordinate (e.g., 51.5074)">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
                <NumberInput step={0.0001} precision={4}>
                  <NumberInputField
                    {...register("latitude", {
                      required: "Latitude is required",
                      min: {
                        value: -90,
                        message: "Must be between -90 and 90",
                      },
                      max: { value: 90, message: "Must be between -90 and 90" },
                    })}
                    placeholder="Enter latitude"
                  />
                </NumberInput>
                <FormHelperText>Format: -90.0000 to 90.0000</FormHelperText>
                <FormErrorMessage>{errors.latitude?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.road_type} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Road Type</Text>
                  <Tooltip label="Type of road where the accident occurred">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
                <Select
                  {...register("road_type", {
                    required: "Road type is required",
                  })}
                >
                  <option value="">Select road type</option>
                  <option value="Single carriageway">Single carriageway</option>
                  <option value="Dual carriageway">Dual carriageway</option>
                  <option value="One way street">One way street</option>
                  <option value="Roundabout">Roundabout</option>
                  <option value="Slip road">Slip road</option>
                  <option value="Other">Other</option>
                </Select>
                <FormErrorMessage>{errors.road_type?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.speed_limit} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Speed Limit</Text>
                  <Tooltip label="Speed limit in miles per hour (mph)">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
                <FormErrorMessage>
                  {errors.speed_limit?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          )}

          {activeStep === 2 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
              <FormControl isInvalid={!!errors.weather_conditions} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Weather Conditions</Text>
                  <Tooltip label="Weather conditions at the time of the accident">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
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
                  <option value="Snowing without high winds">
                    Snowing without high winds
                  </option>
                  <option value="Fine with high winds">
                    Fine with high winds
                  </option>
                  <option value="Raining with high winds">
                    Raining with high winds
                  </option>
                  <option value="Snowing with high winds">
                    Snowing with high winds
                  </option>
                  <option value="Fog or mist">Fog or mist</option>
                  <option value="Other">Other</option>
                </Select>
                <FormErrorMessage>
                  {errors.weather_conditions?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.light_conditions} isRequired>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Text>Light Conditions</Text>
                  <Tooltip label="Lighting conditions at the time of the accident">
                    <Icon as={InfoIcon} color="gray.500" />
                  </Tooltip>
                </FormLabel>
                <Select
                  {...register("light_conditions", {
                    required: "Light conditions are required",
                  })}
                >
                  <option value="">Select light condition</option>
                  <option value="Daylight: Street light present">
                    Daylight: Street light present
                  </option>
                  <option value="Daylight: Street light not present">
                    Daylight: Street light not present
                  </option>
                  <option value="Darkness: Street lights present and lit">
                    Darkness: Street lights present and lit
                  </option>
                  <option value="Darkness: Street lights present but unlit">
                    Darkness: Street lights present but unlit
                  </option>
                  <option value="Darkness: Street lighting unknown">
                    Darkness: Street lighting unknown
                  </option>
                  <option value="Darkness: No street lighting">
                    Darkness: No street lighting
                  </option>
                </Select>
                <FormErrorMessage>
                  {errors.light_conditions?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          )}

          <Box display="flex" justifyContent="space-between" gap={4} mt={6}>
            <Button
              onClick={() => navigate({ to: "/accidents" })}
              variant="outline"
              colorScheme="gray"
            >
              Cancel
            </Button>
            <Box display="flex" gap={4}>
              {activeStep > 0 && (
                <Button onClick={handlePrev} variant="outline">
                  Previous
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button onClick={handleNext} colorScheme="blue">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitClick}
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText={accidentId ? "Updating..." : "Creating..."}
                  leftIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
                >
                  {accidentId ? "Update Accident" : "Create Accident"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
