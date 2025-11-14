import React, { useState, useEffect } from "react";
import axios from "axios";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCategories = () => {
  const [categoryData, setCategoriesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/chart/categories",
        {
          params: {},
        }
      );
      setCategoriesData(response.data);
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
    fetchCategoryData();
  }, []);

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  const categoryChartData = {
    labels: Object.keys(categoryData), // Названия категорий
    datasets: [
      {
        label: "Всего",
        data: Object.values(categoryData), // Значения для каждой категории
        backgroundColor: "rgba(100, 100, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          width: "800px",
          height: "400px",
          margin: "0 auto",
          marginBottom: "50px",
        }}
      >
        <h3>График по категориям проверенных объявлений</h3>
        <Bar data={categoryChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default ChartCategories;
