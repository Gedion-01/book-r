"use client";

import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CircleIcon from "@mui/icons-material/Circle";
import { grey, blue } from "@mui/material/colors";

const EarningSummaryChart = () => {
  // Test data for the chart
  const labels = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const lastSixMonthsData = [150000, 230000, 190000, 220000, 210000, 230000];
  const samePeriodLastYearData = [
    180000, 200000, 170000, 200000, 190000, 220000,
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 808,
        
        padding: 2,
        backgroundColor: "#fff",
        borderRadius: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Earning Summary</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ color: grey[600] }}>
            Mar 2022 - Oct 2024
          </Typography>
          <IconButton size="small" sx={{ ml: 1 }}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </Box>

      <LineChart
        xAxis={[{ data: labels }]}
        series={[
          { data: lastSixMonthsData, label: "Last 6 months", color: blue[500] },
          {
            data: samePeriodLastYearData,
            label: "Same period last year",
            color: grey[500],
          },
        ]}
        height={250}
        width={760}
        grid={{ vertical: false, horizontal: true }}
      />

      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
        <Box display="flex" alignItems="center" mr={3}>
          <CircleIcon sx={{ color: blue[500], fontSize: 10 }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Last 6 months
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <CircleIcon sx={{ color: grey[500], fontSize: 10 }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Same period last year
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EarningSummaryChart;
