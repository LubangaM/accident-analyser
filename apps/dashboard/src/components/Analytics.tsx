import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody,
  Text,
  useColorModeValue,
  Badge,
  Tooltip,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { FiRefreshCw, FiInfo } from "react-icons/fi";
import {
  useAnalyticsSummary,
  useSeverityStats,
  useRoadTypeStats,
  useWeatherStats,
  useTopLocations,
} from "../hooks/useAnalytics";
import { DateRange } from "../types/analytics";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const SeverityColors = {
  1: "#FF4444", // Fatal
  2: "#FFAA00", // Serious
  3: "#00C851", // Slight
};

const SeverityLabels = {
  1: "Fatal",
  2: "Serious",
  3: "Slight",
};

export function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const { data: summary, refetch: refetchSummary } =
    useAnalyticsSummary(dateRange);
  const { data: severityStats, refetch: refetchSeverity } =
    useSeverityStats(dateRange);
  const { data: roadTypeStats, refetch: refetchRoadType } =
    useRoadTypeStats(dateRange);
  const { data: weatherStats, refetch: refetchWeather } =
    useWeatherStats(dateRange);
  const { data: topLocations, refetch: refetchLocations } =
    useTopLocations(dateRange);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      setDateRange({});
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - parseInt(value));
      setDateRange({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });
    }
  };

  const handleRefresh = () => {
    refetchSummary();
    refetchSeverity();
    refetchRoadType();
    refetchWeather();
    refetchLocations();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex align="center">
          <Heading>Analytics Dashboard</Heading>
          <Spacer />
          <HStack spacing={4}>
            <Select
              width="200px"
              onChange={handleDateRangeChange}
              placeholder="Select time range"
              bg={cardBg}
            >
              <option value="all">All Time</option>
              <option value="1">Last Year</option>
              <option value="2">Last 2 Years</option>
              <option value="5">Last 5 Years</option>
            </Select>
            <Tooltip label="Refresh data">
              <IconButton
                aria-label="Refresh data"
                icon={<FiRefreshCw />}
                onClick={handleRefresh}
                variant="ghost"
              />
            </Tooltip>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Accidents</StatLabel>
                <StatNumber>{summary?.total_accidents || 0}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="blue">
                    {summary?.average_vehicles?.toFixed(1)} vehicles/accident
                  </Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Casualties</StatLabel>
                <StatNumber>{summary?.total_casualties || 0}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="red">
                    {summary?.average_casualties?.toFixed(1)} per accident
                  </Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Vehicles</StatLabel>
                <StatNumber>{summary?.total_vehicles || 0}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">
                    {summary?.average_vehicles?.toFixed(1)} per accident
                  </Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Heading size="md">Accidents by Severity</Heading>
                <Spacer />
                <Tooltip label="Shows the distribution of accidents by severity level">
                  <IconButton
                    aria-label="Info"
                    icon={<FiInfo />}
                    variant="ghost"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="severity"
                      tickFormatter={(value) =>
                        SeverityLabels[value as keyof typeof SeverityLabels]
                      }
                    />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number) => [
                        `${value} accidents`,
                        "Count",
                      ]}
                      labelFormatter={(label) =>
                        SeverityLabels[label as keyof typeof SeverityLabels]
                      }
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {severityStats?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SeverityColors[
                              entry.severity as keyof typeof SeverityColors
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Heading size="md">Accidents by Road Type</Heading>
                <Spacer />
                <Tooltip label="Shows the distribution of accidents by road type">
                  <IconButton
                    aria-label="Info"
                    icon={<FiInfo />}
                    variant="ghost"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roadTypeStats}
                      dataKey="count"
                      nameKey="road_type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {roadTypeStats?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} accidents (${props.payload.percentage.toFixed(
                          1
                        )}%)`,
                        name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Heading size="md">Accidents by Weather</Heading>
                <Spacer />
                <Tooltip label="Shows the distribution of accidents by weather conditions">
                  <IconButton
                    aria-label="Info"
                    icon={<FiInfo />}
                    variant="ghost"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weatherStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weather_condition" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} accidents (${props.payload.percentage.toFixed(
                          1
                        )}%)`,
                        "Count",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Heading size="md">Top Accident Locations</Heading>
                <Spacer />
                <Tooltip label="Shows the locations with the highest number of accidents">
                  <IconButton
                    aria-label="Info"
                    icon={<FiInfo />}
                    variant="ghost"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Location</Th>
                    <Th isNumeric>Accidents</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topLocations?.map((location) => (
                    <Tr key={`${location.longitude}-${location.latitude}`}>
                      <Td>
                        <Tooltip label="Click to view on map">
                          <Text cursor="pointer">
                            {location.longitude.toFixed(4)},{" "}
                            {location.latitude.toFixed(4)}
                          </Text>
                        </Tooltip>
                      </Td>
                      <Td isNumeric>
                        <Badge colorScheme="red">{location.count}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
