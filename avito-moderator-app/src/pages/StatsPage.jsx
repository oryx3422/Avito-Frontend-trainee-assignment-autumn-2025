import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartActivity from "../components/ChartActivity";
import ChartCategories from "../components/ChartCategories";
import ChartDecisions from "../components/ChartDecisions";
import StatsCard from "../components/StatsCard";

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [period, setPeriod] = useState("totalReviewed");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const averageReviewTimeMs = stats.averageReviewTime;
  const averageReviewTimeS = averageReviewTimeMs / 1000;
  const averageReviewTimeMin = (averageReviewTimeS / 60).toFixed(2);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3001/api/v1/stats/summary",
        {
          params: {
            period: period,
          },
        }
      );
      setStats(response.data);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных stats: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>
        <b>Статистика модерации</b>
      </h1>
      <br />

      <div>
        <button onClick={() => setPeriod("totalReviewed")}>Всего</button>
        <button onClick={() => setPeriod("totalReviewedToday")}>Сегодня</button>
        <button onClick={() => setPeriod("totalReviewedThisWeek")}>
          Неделя
        </button>
        <button onClick={() => setPeriod("totalReviewedThisMonth")}>
          Месяц
        </button>
      </div>

      <div>
        <h3>Общая информация</h3>
        <br />
        <StatsCard title="Проверено" value={stats[period]} />
        <StatsCard
          title="Одобрено"
          value={`${stats.approvedPercentage.toFixed(2)}%`}
        />
        <StatsCard
          title="Отклонено"
          value={`${stats.rejectedPercentage.toFixed(2)}%`}
        />
        <StatsCard title="Ср. время" value={`${averageReviewTimeMin} мин.`} />
      </div>
      <br />
      <ChartActivity  />
      <ChartCategories />
      <ChartDecisions />
    </div>
  );
};

export default StatsPage;
