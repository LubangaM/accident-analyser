import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useColorModeValue,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Icon,
  Tooltip,
  Badge,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Code,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import Papa from "papaparse";
import { FiUpload, FiInfo, FiCheck, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";

interface CsvUploadFormProps {
  onUploadComplete?: () => void;
}

const MotionBox = motion(Box);

export function CsvUploadForm({ onUploadComplete }: CsvUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");

  const requiredColumns = [
    "date",
    "longitude",
    "latitude",
    "accident_severity",
    "number_of_vehicles",
    "number_of_casualties",
    "road_type",
    "speed_limit",
    "weather_conditions",
    "light_conditions",
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setValidationErrors([]);

    // Preview the CSV file
    Papa.parse(selectedFile, {
      header: true,
      preview: 5,
      complete: (results) => {
        if (results.data.length > 0) {
          const fileHeaders = Object.keys(
            results.data[0] as Record<string, unknown>
          );
          setHeaders(fileHeaders);
          setPreviewData(results.data as Record<string, unknown>[]);

          // Validate required columns
          const missingColumns = requiredColumns.filter(
            (col) => !fileHeaders.includes(col)
          );

          if (missingColumns.length > 0) {
            setValidationErrors([
              `Missing required columns: ${missingColumns.join(", ")}`,
            ]);
          }
        }
      },
      error: (error) => {
        setError("Error parsing CSV file: " + error.message);
      },
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:8000/api/v1/accidents/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${result.count} accidents`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onUploadComplete) {
        onUploadComplete();
      }

      navigate({ to: "/accidents" });
    } catch (error) {
      setError("Error uploading file: " + (error as Error).message);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex align="center">
          <Heading>Upload Accidents CSV</Heading>
          <Spacer />
          <Button leftIcon={<FiDownload />} variant="outline" onClick={onOpen}>
            Download Template
          </Button>
        </Flex>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={4}>
              <Icon as={FiUpload} boxSize={6} color="blue.500" />
              <Box>
                <Heading size="md">Upload CSV File</Heading>
                <Text color="gray.500">
                  Drag and drop your CSV file or click to browse
                </Text>
              </Box>
            </HStack>
          </CardHeader>
          <CardBody>
            <MotionBox
              border="2px dashed"
              borderColor={error ? "red.300" : "gray.300"}
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              _hover={{ borderColor: "blue.300" }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <FormControl isInvalid={!!error}>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  display="none"
                  id="file-upload"
                />
                <FormLabel htmlFor="file-upload" cursor="pointer">
                  {file ? (
                    <VStack spacing={2}>
                      <HStack>
                        <Icon as={FiCheck} color="green.500" />
                        <Text fontWeight="medium">{file.name}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Click to change file
                      </Text>
                    </VStack>
                  ) : (
                    <VStack spacing={2}>
                      <Text>Select or drag and drop your CSV file</Text>
                      <Text fontSize="sm" color="gray.500">
                        Maximum file size: 10MB
                      </Text>
                    </VStack>
                  )}
                </FormLabel>
                <FormHelperText>
                  Your CSV file should include all required columns
                </FormHelperText>
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
            </MotionBox>

            {validationErrors.length > 0 && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    {validationErrors.map((error, index) => (
                      <Text key={index}>{error}</Text>
                    ))}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {isUploading && (
              <Box mt={4}>
                <Progress value={uploadProgress} size="sm" colorScheme="blue" />
                <Text mt={2} textAlign="center">
                  Uploading...
                </Text>
              </Box>
            )}

            {previewData.length > 0 && (
              <Box mt={6}>
                <HStack spacing={2} mb={4}>
                  <Text fontWeight="bold">Preview (First 5 rows)</Text>
                  <Tooltip label="This is how your data will be imported">
                    <Icon as={FiInfo} color="gray.500" />
                  </Tooltip>
                </HStack>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {headers.map((header) => (
                          <Th key={header}>
                            <HStack>
                              <Text>{header}</Text>
                              {requiredColumns.includes(header) && (
                                <Badge colorScheme="blue" fontSize="xs">
                                  Required
                                </Badge>
                              )}
                            </HStack>
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {previewData.map((row, index) => (
                        <Tr key={index}>
                          {headers.map((header) => (
                            <Td key={header}>{row[header] as string}</Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}

            <Button
              mt={6}
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={isUploading}
              isDisabled={!file || !!error || validationErrors.length > 0}
              leftIcon={<FiUpload />}
              width="full"
            >
              Upload CSV
            </Button>
          </CardBody>
        </Card>

        <Alert status="info" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle>CSV Format Requirements</AlertTitle>
            <AlertDescription>
              Your CSV file should include the following columns:
              <br />
              - date (YYYY-MM-DD)
              <br />
              - longitude (decimal)
              <br />
              - latitude (decimal)
              <br />
              - accident_severity (1=Fatal, 2=Serious, 3=Slight)
              <br />
              - number_of_vehicles (integer)
              <br />
              - number_of_casualties (integer)
              <br />
              - road_type (text)
              <br />
              - speed_limit (integer)
              <br />
              - weather_conditions (text)
              <br />- light_conditions (text)
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Download CSV Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Download this template to ensure your CSV file has the correct
              format:
            </Text>
            <Box overflowX="auto" p={2} bg="gray.50" borderRadius="md">
              <Code display="block" whiteSpace="pre-wrap" p={2}>
                date,longitude,latitude,accident_severity,number_of_vehicles,number_of_casualties,road_type,speed_limit,weather_conditions,light_conditions
                2024-01-01,-0.1276,51.5074,2,2,1,Single carriageway,30,Fine
                without high winds,Daylight: Street light present
              </Code>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                const template = `date,longitude,latitude,accident_severity,number_of_vehicles,number_of_casualties,road_type,speed_limit,weather_conditions,light_conditions
2024-01-01,-0.1276,51.5074,2,2,1,Single carriageway,30,Fine without high winds,Daylight: Street light present`;
                const blob = new Blob([template], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "accidents_template.csv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                onClose();
              }}
            >
              Download Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
