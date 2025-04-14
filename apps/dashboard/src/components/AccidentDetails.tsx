import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
  Flex,
  Badge,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiAlertTriangle,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { format, parseISO } from "date-fns";
import { Accident } from "../types/accident";

const fetchAccidentDetails = async (id: string | number): Promise<Accident> => {
  const response = await fetch(`http://localhost:8000/api/v1/accidents/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Accident not found");
    }
    throw new Error("Failed to fetch accident details");
  }
  return response.json();
};

const InfoItem = ({
  label,
  value,
  icon,
  formatter = (v: any) => String(v),
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ElementType;
  formatter?: (value: any) => string;
}) => {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <Flex align="center" gap={2}>
      {icon && <Icon as={icon} color="gray.500" />}
      <Text fontWeight="bold" color="gray.500" fontSize="sm">
        {label}:
      </Text>
      <Text>{formatter(value)}</Text>
    </Flex>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colorScheme =
    {
      Fatal: "red",
      Serious: "orange",
      Slight: "yellow",
    }[severity] || "gray";

  return (
    <Badge
      colorScheme={colorScheme}
      fontSize="sm"
      px={2}
      py={1}
      borderRadius="full"
    >
      {severity}
    </Badge>
  );
};

export interface AccidentDetailsParams {
  accidentId: number | string;
}

export default function AccidentDetails({ accidentId }: AccidentDetailsParams) {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    data: accident,
    isLoading,
    error,
  } = useQuery<Accident, Error>({
    queryKey: ["accident", accidentId],
    queryFn: () => fetchAccidentDetails(accidentId),
  });

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Stack spacing={4}>
          <Skeleton height="60px" />
          <Skeleton height="200px" />
          <Skeleton height="200px" />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {error.message === "Accident not found"
              ? "Accident Not Found"
              : "Error Loading Accident"}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error.message === "Accident not found"
              ? "The accident you're looking for doesn't exist or has been removed."
              : "There was an error loading the accident details. Please try again later."}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (!accident) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="lg">Accident Details</Heading>
              <SeverityBadge severity={accident.accident_severity} />
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <GridItem>
                <InfoItem
                  label="Date"
                  value={accident.date}
                  icon={FiCalendar}
                  formatter={(v) => format(parseISO(v), "PPP")}
                />
              </GridItem>
              <GridItem>
                <InfoItem label="Time" value={accident.time} icon={FiClock} />
              </GridItem>
              <GridItem>
                <InfoItem
                  label="Location"
                  value={accident.local_authority_district}
                  icon={FiMapPin}
                />
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Details Grid */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Accident Information */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Heading size="md">Accident Information</Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <InfoItem
                  label="Vehicles Involved"
                  value={accident.number_of_vehicles}
                  icon={FiTruck}
                />
                <InfoItem
                  label="Casualties"
                  value={accident.number_of_casualties}
                  icon={FiUsers}
                />
                <InfoItem
                  label="Road Type"
                  value={accident.road_type}
                  icon={FiMapPin}
                />
                <InfoItem
                  label="Speed Limit"
                  value={accident.speed_limit}
                  formatter={(v) => `${v} mph`}
                />
              </VStack>
            </CardBody>
          </Card>

          {/* Conditions */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <Heading size="md">Conditions</Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <InfoItem label="Weather" value={accident.weather_conditions} />
                <InfoItem
                  label="Light Conditions"
                  value={accident.light_conditions}
                />
                <InfoItem
                  label="Road Surface"
                  value={accident.road_surface_conditions}
                />
                <InfoItem
                  label="Special Conditions"
                  value={accident.special_conditions_at_site}
                  icon={FiAlertTriangle}
                />
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Additional Details */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Heading size="md">Additional Details</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <InfoItem
                    label="Police Force"
                    value={accident.police_force}
                  />
                  <InfoItem
                    label="Police Attended"
                    value={accident.did_police_officer_attend}
                  />
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="stretch" spacing={4}>
                  <InfoItem
                    label="Area Type"
                    value={accident.urban_or_rural_area}
                  />
                  <InfoItem
                    label="Junction Control"
                    value={accident.junction_control}
                  />
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
