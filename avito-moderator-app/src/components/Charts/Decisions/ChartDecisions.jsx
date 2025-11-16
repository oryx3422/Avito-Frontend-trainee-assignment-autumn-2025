import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import classes from "./ChartDecisions.module.css";

const ChartDecisions = () => {
  const [decisionsData, setDecisionsData] = useState({
    approved: 0,
    rejected: 0,
    requestChanges: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecisionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/chart/decisions"
      );
      setDecisionsData(response.data);
    } catch (err) {
      setError(
        `Произошла ошибка при загрузке данных decisions: ${err.message}`
      );
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisionData();
  }, []);

  if (loading) return <div className={classes.loading}>загрузка...</div>;
  if (error) return <div className={classes.error}>{error}</div>;

  const values = [
    decisionsData.approved,
    decisionsData.rejected,
    decisionsData.requestChanges,
  ];

  const total = values.reduce((a, b) => a + b, 0);

  const decisionsChartData = {
    labels: ["Одобрено", "Отклонено", "На доработку"],
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(0, 255, 0, 0.5)",
          "rgba(255, 0, 0, 0.5)",
          "rgba(255, 255, 0, 0.5)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={classes.chartWrapper}>
      <h3 className={classes.chartTitle}>Распределение решений</h3>

      <div className={classes.chartContainer}>
        <Pie
          data={decisionsChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },

              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw;
                    if (value === 0) return "";
                    const percent = ((value / total) * 100).toFixed(2);
                    return `${context.label}: ${percent}%`;
                  },
                },
              },

              datalabels: {
                color: "#000",
                font: { size: 14 },
                formatter: (value) => {
                  if (value === 0 || total === 0) return "";
                  const percent = ((value / total) * 100).toFixed(2);
                  return `${percent}%`;
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartDecisions;
