import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        "http://localhost:3001/api/v1/stats/chart/decisions",
        {
          params: {},
        }
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

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  const decisionsChartData = {
    labels: ["Одобрено", "Отклонено", "На доработку"],
    datasets: [
      {
        data: [
          decisionsData.approved,
          decisionsData.rejected,
          decisionsData.requestChanges,
        ],
        backgroundColor: [
          "rgb(0, 255, 0, 0.5)",
          "rgb(255, 0, 0, 0.5)",
          "rgb(255, 255, 0, 0.5)",
        ],
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          width: "400px",
          height: "400px",
          margin: "0 auto",
          marginBottom: "50px",
        }}
      >
        <h3>Распределение решений</h3>
        <Pie
          data={decisionsChartData}
          options={{
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default ChartDecisions;

