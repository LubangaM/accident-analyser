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
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import {
  useAnalyticsSummary,
  useSeverityStats,
  useRoadTypeStats,
  useWeatherStats,
  useTopLocations,
} from "../hooks/useAnalytics";
import { DateRange } from "../types/analytics";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const { data: summary } = useAnalyticsSummary(dateRange);
  const { data: severityStats } = useSeverityStats(dateRange);
  const { data: roadTypeStats } = useRoadTypeStats(dateRange);
  const { data: weatherStats } = useWeatherStats(dateRange);
  const { data: topLocations } = useTopLocations(dateRange);

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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading>Analytics Dashboard</Heading>
          <Select
            width="200px"
            onChange={handleDateRangeChange}
            placeholder="Select time range"
          >
            <option value="all">All Time</option>
            <option value="1">Last Year</option>
            <option value="2">Last 2 Years</option>
            <option value="5">Last 5 Years</option>
          </Select>
        </HStack>

        <SimpleGrid columns={4} spacing={4}>
          <Stat>
            <StatLabel>Total Accidents</StatLabel>
            <StatNumber>{summary?.total_accidents || 0}</StatNumber>
            <StatHelpText>
              Average: {summary?.average_vehicles?.toFixed(1)} vehicles per
              accident
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Casualties</StatLabel>
            <StatNumber>{summary?.total_casualties || 0}</StatNumber>
            <StatHelpText>
              Average: {summary?.average_casualties?.toFixed(1)} per accident
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Vehicles</StatLabel>
            <StatNumber>{summary?.total_vehicles || 0}</StatNumber>
            <StatHelpText>
              Average: {summary?.average_vehicles?.toFixed(1)} per accident
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={8}>
          <Box>
            <Heading size="md" mb={4}>
              Accidents by Severity
            </Heading>
            <BarChart width={500} height={300} data={severityStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Accidents by Road Type
            </Heading>
            <PieChart width={500} height={300}>
              <Pie
                data={roadTypeStats}
                dataKey="count"
                nameKey="road_type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {roadTypeStats?.map(
                  (
                    entry: {
                      road_type: string;
                      count: number;
                      percentage: number;
                    },
                    index: number
                  ) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Accidents by Weather
            </Heading>
            <BarChart width={500} height={300} data={weatherStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weather_condition" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Top Accident Locations
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Location</Th>
                  <Th>Accidents</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topLocations?.map(
                  (location: {
                    longitude: number;
                    latitude: number;
                    count: number;
                  }) => (
                    <Tr key={`${location.longitude}-${location.latitude}`}>
                      <Td>
                        {location.longitude.toFixed(4)},{" "}
                        {location.latitude.toFixed(4)}
                      </Td>
                      <Td>{location.count}</Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
