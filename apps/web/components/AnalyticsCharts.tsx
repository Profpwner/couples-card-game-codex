import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AnalyticsCharts({ packsSold, revenueCents, readers, avgSessionSec }: { packsSold: number; revenueCents: number; readers: number; avgSessionSec: number }) {
  const revenue = revenueCents / 100;
  const salesData = {
    labels: ['Packs Sold', 'Revenue ($)'],
    datasets: [
      {
        label: 'Sales',
        data: [packsSold, revenue],
        backgroundColor: ['#4caf50', '#0b5fff'],
      },
    ],
  };
  const engData = {
    labels: ['Readers', 'Avg Session (s)'],
    datasets: [
      {
        label: 'Engagement',
        data: [readers, avgSessionSec],
        backgroundColor: ['#ff9800', '#9c27b0'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Readers vs Sessions'],
    datasets: [
      {
        label: 'Engagement split',
        data: [readers, avgSessionSec],
        backgroundColor: ['#ff9800', '#9c27b0'],
      },
    ],
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
      <div>
        <h4>Sales Overview</h4>
        <Bar data={salesData} options={{ plugins: { legend: { display: false } } }} />
      </div>
      <div>
        <h4>Engagement Overview</h4>
        <Bar data={engData} options={{ plugins: { legend: { display: false } } }} />
      </div>
      <div>
        <h4>Engagement Split</h4>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}
