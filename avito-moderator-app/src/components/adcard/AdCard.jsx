import classes from "./AdCard.module.css";

const statusLabels = {
  approved: "Одобрено",
  rejected: "Отклонено",
  pending: "Ждет проверки",
  draft: "Доработка",
};

const AdCard = ({ ad }) => {
  return (
    <div className={classes.adCard}>

      <div className={classes.adImageContainer}>
        <img
          loading="lazy"
          className={classes.adImage}
          src={ad.images && ad.images.length > 0 ? ad.images[0] : ""}
          alt={`изображение ${ad.title} `}
          onError={(e) => (e.target.src = "default-image.jpg")}
        />
      </div>

       <div className={classes.adInfo}>
        <h3 className={classes.adTitle}>{ad.title}</h3>
        
        <p className={classes.adPrice}>
          {ad.price > 0
            ? `${ad.price.toLocaleString("ru-RU")} ₽`
            : "Цена не указана."}
        </p>
        
        <p className={classes.adMeta}>
          {ad.category} | {new Date(ad.createdAt).toLocaleDateString()}
        </p>

        <p className={`${classes.adStatus} ${classes[ad.status]}`}>
          Статус: {statusLabels[ad.status] || "неизвестно"}
        </p>
        <p className={classes.adPriority}>
          Приоритет: {ad.priority === "urgent" ? "срочный" : "обычный"}
        </p>
      </div>

    </div>
  );
};

export default AdCard;
