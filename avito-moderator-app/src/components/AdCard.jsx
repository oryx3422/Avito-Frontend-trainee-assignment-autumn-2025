import React from "react";

const AdCard = ({ ad }) => {
  return (
    <div className="ad-card">
      <div className="ad-image__container">
        <img
          loading="lazy"
          className="ad-image"
          src={ad.images && ad.images.length > 0 ? ad.images[0] : ""}
          alt={`изображение ${ad.title} `}
          onError={(e) => e.target.src("default-image.jpg")}
        />
      </div>
      <div className="ad-details">
        <h3 className="ad-title">{ad.title}</h3>
        <p className="ad-price">
          {ad.price > 0
            ? `${ad.price.toLocaleString("ru-RU")} ₽`
            : "Цена не указана."}
        </p>
        <p className="ad-date">
          Дата создания: {new Date(ad.createdAt).toLocaleDateString()}
        </p>
        <br />

        <p className="ad-category">Категория: {ad.category}</p>
        <p className="ad-status">
          Статус:{" "}
          {ad.status === "approve"
            ? "одобрено"
            : ad.status === "rejected"
            ? "отклонено"
            : "на модерации"}
        </p>
        <p className="ad-priority">
          Приоритет: {ad.priority === "urgent" ? "срочный" : "обычный"}
        </p>
      </div>
    </div>
  );
};

export default AdCard;
