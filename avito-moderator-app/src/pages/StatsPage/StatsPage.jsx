import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartActivity from "../../components/Charts/Activity/ChartActivity";
import ChartCategories from "../../components/Charts/Categories/ChartCategories";
import ChartDecisions from "../../components/Charts/Decisions/ChartDecisions";
import StatsCard from "../../components/StatsCard/StatsCard";

import MyButton from "../../UI/button/MyButton";

import classes from "./StatsPage.module.css";

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
          params: { period },
        }
      );
      setStats(response.data);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных stats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  if (loading) return <div className={classes.loading}>загрузка...</div>;
  if (error) return <div className={classes.error}>{error}</div>;

  return (
    <div className={classes.pageWrapper}>

      <div className={classes.periodButtons}>
        <h2 className={classes.periodTitle} style={{fontWeight: "600"}}>Период: </h2>
        <MyButton
          onClick={() => setPeriod("totalReviewed")}>
          Всего
        </MyButton>

        <MyButton
          onClick={() => setPeriod("totalReviewedToday")}
       
        >
          Сегодня
        </MyButton>

        <MyButton
          onClick={() => setPeriod("totalReviewedThisWeek")}
       
        >
          Неделя
        </MyButton>

        <MyButton
          onClick={() => setPeriod("totalReviewedThisMonth")}
        >
          Месяц
        </MyButton>
      </div>

      <div className={classes.infoBlock}>
        <div className={classes.statsGrid}>
          <StatsCard title="Проверено" value={stats[period]} />
          <StatsCard title="Одобрено" value={`${stats.approvedPercentage.toFixed(2)}%`} />
          <StatsCard title="Отклонено" value={`${stats.rejectedPercentage.toFixed(2)}%`} />
          <StatsCard title="Доработка" value={`${stats.requestChangesPercentage.toFixed(2)}%`} />
          <StatsCard title="Ср. время" value={`${averageReviewTimeMin} мин.`} />
        </div>
      </div>

      <ChartActivity />
      <ChartCategories />
      <ChartDecisions />
    </div>
  );
};

export default StatsPage;
