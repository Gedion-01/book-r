"use client";
import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface EarningSummaryChartProps {
  data: { month: string; thisYear: number; lastYear: number }[];
  title: string;
  subtitle: string;
}

const EarningSummaryChart: React.FC<EarningSummaryChartProps> = ({
  data,
  title,
  subtitle,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, width: "100%", boxShadow: 0 }}
    >
      <Box mb={2} sx={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            marginTop: "52px",
            color: "rgba(26, 25, 25, 1)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4299e1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#718096" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#718096" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Area
              type="monotone"
              dataKey="thisYear"
              stroke="#4299e1"
              fillOpacity={1}
              fill="url(#colorThisYear)"
              name="Last 6 months"
            />
            <Area
              type="monotone"
              dataKey="lastYear"
              stroke="#718096"
              fillOpacity={1}
              fill="url(#colorLastYear)"
              name="Same period last year"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default EarningSummaryChart;
