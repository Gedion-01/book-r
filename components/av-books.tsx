"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, Typography, Box, Grid } from "@mui/material";
import "chart.js/auto";

// Function to generate random colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface Category {
  label: string;
  count: number;
  color?: string;
}

interface PieChartWithCenterLabelProps {
  data: { label: string; value: number }[];
}

const PieChartCard = ({ data }: PieChartWithCenterLabelProps) => {
  // Map the data to the required structure and generate colors if not provided
  const categories = data.map((category) => ({
    label: category.label,
    count: category.value,
    color: generateRandomColor(),
  }));

  const chartData = {
    labels: categories.map((category) => category.label),
    datasets: [
      {
        label: "Available Books",
        data: categories.map((category) => category.count),
        backgroundColor: categories.map((category) => category.color),
        hoverBackgroundColor: categories.map((category) => category.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
      }}
    >
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "36px",
          marginBottom: "30px",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            color: "#525256",
          }}
        >
          Available Books
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            color: "#525256",
            paddingX: "8px",
            paddingY: "4px",
            bgcolor: "#F4F5F7",
            borderRadius: "2px",
          }}
        >
          Today
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: "176px", marginBottom: "20px" }}>
          <Pie
            data={chartData}
            options={{
              cutout: "80%",
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={1}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.label}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(26, 25, 25, 1)",
              }}
            >
              <Box
                width={16}
                height={16}
                bgcolor={category.color}
                mr={1}
                borderRadius="100%"
              />
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                {category.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, fontSize: "16px", lineHeight: "24px" }}
              >
                {category.count}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default PieChartCard;
