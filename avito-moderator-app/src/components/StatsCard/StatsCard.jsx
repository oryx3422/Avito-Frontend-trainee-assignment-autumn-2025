import classes from "./StatsCard.module.css";

const StatsCard = ({ title, value }) => {
  return (
    <div className={classes.card}>
      <p className={classes.title}>{title}</p>
      <p className={classes.value}>{value}</p>
    </div>
  );
};

export default StatsCard;
