"use client";

import { useEffect, useRef } from "react";
import {
  Chart, BarController, BarElement, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip,
} from "chart.js";

Chart.register(
  BarController, BarElement, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip
);

export default function Charts() {
  const performanceRef = useRef<HTMLCanvasElement>(null);
  const growthRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!performanceRef.current || !growthRef.current) return;

    const perfChart = new Chart(performanceRef.current, {
      type: "bar",
      data: {
        labels: ["Math", "Science", "English", "History", "Art", "PE"],
        datasets: [{
          label: "Avg Score",
          data: [85, 72, 90, 78, 95, 88],
          backgroundColor: "#3b82f6",
          borderRadius: 4,
          barThickness: 20,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" }, ticks: { font: { family: "Inter", size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { family: "Inter", size: 11 } } },
        },
      },
    });

    const growthChart = new Chart(growthRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "New Users",
          data: [65, 78, 90, 115, 145, 180],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139,92,246,0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#8b5cf6",
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { family: "Inter", size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { family: "Inter", size: 11 } } },
        },
      },
    });

    return () => { perfChart.destroy(); growthChart.destroy(); };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 text-[15px]">Student Performance Overview</h3>
          <select className="text-xs border border-gray-200 rounded-md text-gray-500 px-2 py-1 outline-none">
            <option>This Semester</option>
            <option>Last Semester</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <canvas ref={performanceRef} />
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 text-[15px]">User Growth Over Time</h3>
          <select className="text-xs border border-gray-200 rounded-md text-gray-500 px-2 py-1 outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <canvas ref={growthRef} />
        </div>
      </div>
    </div>
  );
}
