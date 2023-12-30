// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const CustomLineChart = ({labels, commits, issues, pullRequests, pullRequestReviews}) => {
  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Multi Axis",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Commits",
        data: commits, 
        borderColor: "rgb(119, 197, 230)",
        backgroundColor: "rgba(119, 197, 230, 0.5)",
        yAxisID: "y",
        pointStyle: 'rectRounded',
      },
      {
        label: "Issues",
        data: issues,
        borderColor: "rgb(217, 119, 230)",
        backgroundColor: "rgba(217, 119, 230, 0.5)",
        yAxisID: "y",
        pointStyle: 'rectRounded',
      },
      {
        label: "PRs",
        data: pullRequests,
        yAxisID: "y",
        borderColor: "rgb(119, 230, 167)",
        backgroundColor: "rgba(119, 230, 167, 0.5)",
        pointStyle: 'rectRounded',
      },
      {
        label: "PR Reviews",
        data: pullRequestReviews,
        borderColor: "rgb(119, 230, 167)",
        backgroundColor: "rgba(119, 230, 167, 0.5)",
        yAxisID: "y",
        pointStyle: 'rectRounded',
      },
    ],
  };
  return (
      <Line options={options} data={data} />
  );
};

export default CustomLineChart;
