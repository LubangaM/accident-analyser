import { Link as RouterLink } from "@tanstack/react-router";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Container,
  useToast,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useAccidents, useDeleteAccident } from "../hooks/useAccidents";
import { useState } from "react";

export function AccidentList() {
  const { data: accidents, isLoading } = useAccidents();
  const deleteAccident = useDeleteAccident();
  const toast = useToast();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const handleDelete = async (id: number) => {
    try {
      await deleteAccident.mutateAsync(id);
      toast({
        title: "Accident deleted",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting accident",
        status: "error",
        duration: 3000,
      });
    }
  };

  const filteredAccidents = accidents?.filter(
    (accident) =>
      selectedSeverity === "all" ||
      accident.accident_severity === selectedSeverity
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading>Accidents</Heading>
        <HStack spacing={4}>
          <Select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            width="200px"
          >
            <option value="all">All Severities</option>
            <option value="1">Fatal</option>
            <option value="2">Serious</option>
            <option value="3">Slight</option>
          </Select>
          <Button as={RouterLink} to="/accidents/new" colorScheme="blue">
            Add Accident
          </Button>
        </HStack>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Accident Index</Th>
            <Th>Severity</Th>
            <Th>Location</Th>
            <Th>Vehicles</Th>
            <Th>Casualties</Th>
            <Th>Road Type</Th>
            <Th>Weather</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAccidents?.map((accident) => (
            <Tr key={accident.id}>
              <Td>{new Date(accident.date).toLocaleDateString()}</Td>
              <Td>{accident.accident_index}</Td>
              <Td>
                {accident.accident_severity === "1"
                  ? "Fatal"
                  : accident.accident_severity === "2"
                    ? "Serious"
                    : "Slight"}
              </Td>
              <Td>
                {accident.longitude && accident.latitude
                  ? `${accident.longitude.toFixed(
                      4
                    )}, ${accident.latitude.toFixed(4)}`
                  : "N/A"}
              </Td>
              <Td>{accident.number_of_vehicles || "N/A"}</Td>
              <Td>{accident.number_of_casualties || "N/A"}</Td>
              <Td>{accident.road_type || "N/A"}</Td>
              <Td>{accident.weather_conditions || "N/A"}</Td>
              <Td>
                <Button
                  as={RouterLink}
                  to="/accidents/$id/edit"
                  // params={{ id: accident.id.toString() }}
                  size="sm"
                  mr={2}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(accident.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}
