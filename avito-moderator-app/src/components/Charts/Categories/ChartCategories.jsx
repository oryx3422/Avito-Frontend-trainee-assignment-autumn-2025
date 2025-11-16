import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import classes from "./ChartCategories.module.css";

const ChartCategories = () => {
  const [categoryData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/chart/categories"
      );
      setCategoriesData(response.data);
    } catch (err) {
      setError(
        `Произошла ошибка при загрузке данных categories: ${err.message}`
      );
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  if (loading) return <div className={classes.loading}>загрузка...</div>;
  if (error) return <div className={classes.error}>{error}</div>;

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Всего",
        data: Object.values(categoryData),
        backgroundColor: "rgba(100, 100, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={classes.chartWrapper}>
      <h3 className={classes.chartTitle}>
        График по категориям проверенных объявлений
      </h3>

      <div className={classes.chartContainer}>
        <Bar
          data={categoryChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              datalabels: { display: false },
            },
            scales: {
              y: {
                ticks: {
                  stepSize: 1,
                  callback: (value) =>
                    Number.isInteger(value) ? value : null,
                },
              },
              x: {
                ticks: {
                  autoSkip: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartCategories;
