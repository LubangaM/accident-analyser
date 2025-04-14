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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { useAccidents, useDeleteAccident } from "../hooks/useAccidents";
import { useState, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUpload,
  FaEye,
} from "react-icons/fa";
import { format } from "date-fns";
import { CsvUploadForm } from "./CsvUploadForm";

type SortField = "date" | "severity" | "vehicles" | "casualties";
type SortOrder = "asc" | "desc";

export function AccidentList() {
  const { data: accidents, isLoading, error } = useAccidents();
  const deleteAccident = useDeleteAccident();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <Button
            as={RouterLink}
            to="/accidents/upload"
            leftIcon={<FaUpload />}
            colorScheme="green"
            variant="outline"
          >
            Upload CSV
          </Button>
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
              <Th>Date</Th>
              <Th>
                <HStack
                  spacing={2}
                  cursor="pointer"
                  onClick={() => handleSort("severity")}
                >
                  <Text>Severity</Text>
                  {sortField === "severity" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </HStack>
              </Th>
              <Th>Location</Th>
              <Th>
                <HStack
                  spacing={2}
                  cursor="pointer"
                  onClick={() => handleSort("vehicles")}
                >
                  <Text>Vehicles</Text>
                  {sortField === "vehicles" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </HStack>
              </Th>
              <Th>
                <HStack
                  spacing={2}
                  cursor="pointer"
                  onClick={() => handleSort("casualties")}
                >
                  <Text>Casualties</Text>
                  {sortField === "casualties" ? (
                    sortOrder === "asc" ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </HStack>
              </Th>
              <Th textAlign="right" width="150px">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedAccidents.map((accident) => (
              <Tr
                key={accident.id}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                cursor="pointer"
                onClick={() => {
                  window.location.href = `/accidents/${accident.id}`;
                }}
              >
                <Td>{format(new Date(accident.date), "PPP")}</Td>
                <Td>{getSeverityBadge(accident.accident_severity)}</Td>
                <Td>{accident.local_authority_district || "Unknown"}</Td>
                <Td>{accident.number_of_vehicles || 0}</Td>
                <Td>{accident.number_of_casualties || 0}</Td>
                <Td onClick={(e) => e.stopPropagation()} textAlign="right">
                  <HStack spacing={2} justify="flex-end">
                    <Tooltip label="View Details">
                      <IconButton
                        as={RouterLink}
                        to={`/accidents/${accident.id}`}
                        icon={<FaEye />}
                        aria-label="View details"
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                      />
                    </Tooltip>
                    <Tooltip label="Edit">
                      <IconButton
                        as={RouterLink}
                        to={`/accidents/${accident.id}/edit`}
                        icon={<FaEdit />}
                        aria-label="Edit"
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete"
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Accidents CSV</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CsvUploadForm onUploadComplete={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
