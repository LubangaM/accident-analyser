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
  Badge,
  Text,
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
  TableContainer,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
} from "@chakra-ui/react";
import { useAccidents, useDeleteAccident } from "../hooks/useAccidents";
import { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { format } from "date-fns";

type SortField = "date" | "severity" | "vehicles" | "casualties";
type SortOrder = "asc" | "desc";

export function AccidentList() {
  const { data: accidents, isLoading, error } = useAccidents();
  const deleteAccident = useDeleteAccident();
  const toast = useToast();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedAccidents = useMemo(() => {
    if (!accidents) return [];

    let filtered = accidents.filter(
      (accident) =>
        selectedSeverity === "all" ||
        accident.accident_severity === selectedSeverity
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "severity":
          comparison = a.accident_severity.localeCompare(b.accident_severity);
          break;
        case "vehicles":
          comparison =
            (a.number_of_vehicles || 0) - (b.number_of_vehicles || 0);
          break;
        case "casualties":
          comparison =
            (a.number_of_casualties || 0) - (b.number_of_casualties || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [accidents, selectedSeverity, sortField, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedAccidents.length / itemsPerPage
  );
  const paginatedAccidents = filteredAndSortedAccidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      "1": { label: "Fatal", color: "red" },
      "2": { label: "Serious", color: "orange" },
      "3": { label: "Slight", color: "yellow" },
    };
    const { label, color } = severityMap[
      severity as keyof typeof severityMap
    ] || { label: "Unknown", color: "gray" };
    return <Badge colorScheme={color}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading accidents</AlertTitle>
        <AlertDescription>Please try again later</AlertDescription>
      </Alert>
    );
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

      <TableContainer
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort("date")}>
                <Flex align="center" gap={2}>
                  Date & Location
                  {sortField === "date" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </Flex>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("severity")}>
                <Flex align="center" gap={2}>
                  Severity
                  {sortField === "severity" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </Flex>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("vehicles")}>
                <Flex align="center" gap={2}>
                  Vehicles
                  {sortField === "vehicles" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </Flex>
              </Th>
              <Th cursor="pointer" onClick={() => handleSort("casualties")}>
                <Flex align="center" gap={2}>
                  Casualties
                  {sortField === "casualties" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </Flex>
              </Th>
              <Th>Road Type</Th>
              <Th>Weather</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedAccidents.map((accident) => (
              <Tr
                key={accident.id}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">
                      {format(new Date(accident.date), "MMM d, yyyy")}
                    </Text>
                    {accident.longitude && accident.latitude ? (
                      <Text fontSize="sm" color="gray.500">
                        {accident.longitude.toFixed(4)},{" "}
                        {accident.latitude.toFixed(4)}
                      </Text>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        Location not available
                      </Text>
                    )}
                  </VStack>
                </Td>
                <Td>{getSeverityBadge(accident.accident_severity)}</Td>
                <Td>{accident.number_of_vehicles || "N/A"}</Td>
                <Td>{accident.number_of_casualties || "N/A"}</Td>
                <Td>{accident.road_type || "N/A"}</Td>
                <Td>{accident.weather_conditions || "N/A"}</Td>
                <Td width="120px">
                  <HStack spacing={3} justify="flex-end">
                    <Tooltip label="Edit">
                      <IconButton
                        as={RouterLink}
                        to="/accidents/$id/edit"
                        params={{ id: String(accident.id) }}
                        aria-label="Edit accident"
                        icon={<FaEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        aria-label="Delete accident"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(accident.id)}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Flex justify="center" mt={4} gap={2}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </Flex>
      )}
    </Container>
  );
}
