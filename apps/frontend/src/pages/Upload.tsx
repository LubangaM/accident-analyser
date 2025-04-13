import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Progress,
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
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadResponse {
  message: string;
  total_rows: number;
  status: string;
}

// interface UploadError {
//   row: number;
//   error: string;
// }

export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [preview, setPreview] = useState<any[]>([]);
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      // Preview first 5 rows
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").slice(0, 6); // Header + 5 rows
        const previewData = rows.map((row) => row.split(","));
        setPreview(previewData);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<UploadResponse>(
        "/api/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Started",
        description: `Processing ${data.total_rows} rows`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Box
          {...getRootProps()}
          p={10}
          border="2px dashed"
          borderColor={isDragActive ? "blue.500" : "gray.300"}
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: "blue.500" }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop the CSV file here</Text>
          ) : (
            <Text>Drag and drop a CSV file here, or click to select</Text>
          )}
        </Box>

        {file && (
          <Box>
            <Text>Selected file: {file.name}</Text>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={uploadMutation.isPending}
              mt={2}
            >
              Upload
            </Button>
          </Box>
        )}

        {preview.length > 0 && (
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Preview (first 5 rows)
            </Text>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {preview[0]?.map((header: string, index: number) => (
                      <Th key={index}>{header}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {preview.slice(1).map((row: string[], rowIndex: number) => (
                    <Tr key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <Td key={cellIndex}>{cell}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}

        {uploadMutation.isPending && (
          <Box>
            <Text mb={2}>Uploading...</Text>
            <Progress size="xs" isIndeterminate />
          </Box>
        )}

        {uploadMutation.isSuccess && (
          <Alert status="success">
            <AlertIcon />
            <Box>
              <AlertTitle>Upload Started</AlertTitle>
              <AlertDescription>
                Processing {uploadMutation.data.total_rows} rows
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {uploadMutation.isError && (
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>
                {uploadMutation.error.message}
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};
