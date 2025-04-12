import { useNavigate, useParams } from "@tanstack/react-router";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  useAccident,
  useCreateAccident,
  useUpdateAccident,
} from "../hooks/useAccidents";
import { AccidentCreate } from "../types/accident";

export function AccidentForm() {
  const { id } = useParams({ from: "/accidents/$id/edit" });
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<AccidentCreate>();
  const { data: accident } = useAccident(Number(id));
  const createAccident = useCreateAccident();
  const updateAccident = useUpdateAccident();

  const onSubmit = async (data: AccidentCreate) => {
    try {
      if (id) {
        await updateAccident.mutateAsync({ id: Number(id), ...data });
        toast({
          title: "Accident updated",
          status: "success",
          duration: 3000,
        });
      } else {
        await createAccident.mutateAsync(data);
        toast({
          title: "Accident created",
          status: "success",
          duration: 3000,
        });
      }
      navigate({ to: "/" });
    } catch (error) {
      toast({
        title: "Error saving accident",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>{id ? "Edit Accident" : "New Accident"}</Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={4} mb={6}>
          <FormControl>
            <FormLabel>Accident Index</FormLabel>
            <Input {...register("accident_index")} />
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" {...register("date")} />
          </FormControl>

          <FormControl>
            <FormLabel>Time</FormLabel>
            <Input type="time" {...register("time")} />
          </FormControl>

          <FormControl>
            <FormLabel>Severity</FormLabel>
            <Select {...register("accident_severity")}>
              <option value="1">Fatal</option>
              <option value="2">Serious</option>
              <option value="3">Slight</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Number of Vehicles</FormLabel>
            <NumberInput min={1}>
              <NumberInputField {...register("number_of_vehicles")} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Number of Casualties</FormLabel>
            <NumberInput min={0}>
              <NumberInputField {...register("number_of_casualties")} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Longitude</FormLabel>
            <NumberInput step={0.0001} precision={4}>
              <NumberInputField {...register("longitude")} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Latitude</FormLabel>
            <NumberInput step={0.0001} precision={4}>
              <NumberInputField {...register("latitude")} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Road Type</FormLabel>
            <Select {...register("road_type")}>
              <option value="Single carriageway">Single carriageway</option>
              <option value="Dual carriageway">Dual carriageway</option>
              <option value="One way street">One way street</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Speed Limit</FormLabel>
            <NumberInput min={0}>
              <NumberInputField {...register("speed_limit")} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Weather Conditions</FormLabel>
            <Select {...register("weather_conditions")}>
              <option value="Fine without high winds">Fine without high winds</option>
              <option value="Raining without high winds">Raining without high winds</option>
              <option value="Fog or mist">Fog or mist</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Light Conditions</FormLabel>
            <Select {...register("light_conditions")}>
              <option value="Daylight: Street light present">Daylight: Street light present</option>
              <option value="Darkness: Street lights present and lit">Darkness: Street lights present and lit</option>
              <option value="Darkness: Street lighting unknown">Darkness: Street lighting unknown</option>
            </Select>
          </FormControl>
        </SimpleGrid>

        <Button type="submit" colorScheme="blue" mr={4}>
          {id ? "Update" : "Create"}
        </Button>
        <Button onClick={() => navigate({ to: "/" })}>Cancel</Button>
      </Box>
    </Container>
  );
}
