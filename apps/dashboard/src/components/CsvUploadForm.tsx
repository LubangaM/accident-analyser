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
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import Papa from "papaparse";

interface CsvUploadFormProps {
  onUploadComplete?: () => void;
}

export function CsvUploadForm({ onUploadComplete }: CsvUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Preview the CSV file
    Papa.parse(selectedFile, {
      header: true,
      preview: 5,
      complete: (results) => {
        if (results.data.length > 0) {
          setHeaders(Object.keys(results.data[0] as Record<string, unknown>));
          setPreviewData(results.data as Record<string, unknown>[]);
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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Upload Accidents CSV</Heading>

        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <FormControl isInvalid={!!error}>
            <FormLabel>CSV File</FormLabel>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <FormHelperText>
              Upload a CSV file containing accident data. The file should
              include columns for date, location, severity, and other relevant
              information.
            </FormHelperText>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

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
              <Text fontWeight="bold" mb={2}>
                Preview (First 5 rows):
              </Text>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {headers.map((header) => (
                        <Th key={header}>{header}</Th>
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
            isDisabled={!file || !!error}
          >
            Upload CSV
          </Button>
        </Box>

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
    </Container>
  );
}
