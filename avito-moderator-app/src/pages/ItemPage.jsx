// decompose

import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ModeratorPanel_copy from "../components/ModeratorPanel_copy";

const ItemPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [ads, setAds] = useState(location.state ? location.state.ads : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // console.log(`ads: ${ads}`);
    if (ads && ads.length > 0) {
      const currentAd = ads.find((ad) => ad.id === parseInt(id));
      // console.log(`ad:', ${JSON.stringify(currentAd, null, 2)}`);
      setAd(currentAd);
      const index = ads.findIndex((ad) => ad.id === parseInt(id));
      setCurrentAdIndex(index);
      setLoading(false);
    } else {
      setLoading(false);
      setError("Объявление не найдено!");
    }
  }, [id, ads]);

  // const fetchAdDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `http://localhost:3001/api/v1/ads/${id}`
  //     );
  //     setAd(response.data);
  //   } catch (err) {
  //     setError(`Произошла ошибка при загрузке данных: ${err.message}`);
  //     console.error(`fetch error: ${err}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
  // useEffect(() => {
  //   fetchAdDetails();
  // }, [id]);

  const handleToList = () => {
    console.log(`navigate to list`);
    navigate("/list");
  };

  const handlePrevAd = () => {
    const prevAdIndex = currentAdIndex > 0 ? currentAdIndex - 1 : 0;
    const prevAd = ads[prevAdIndex];
    console.log(`navigate to ad.id: ${prevAd.id}`);
    navigate(`/item/${prevAd.id}`, { state: { ads } });
  };

  const handleNextAd = () => {
    const nextAdIndex =
      currentAdIndex < ads.length - 1 ? currentAdIndex + 1 : ads.length - 1;
    const nextAd = ads[nextAdIndex];
    console.log(`navigate to ad.id: ${nextAd.id}`);
    navigate(`/item/${nextAd.id}`, { state: { ads } });
  };

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  if (!ad) return <div>Объявление не найдено!</div>;

  const moderationHistory = ad.moderationHistory;

  return (
    <div className="item-page">
      <ModeratorPanel_copy adId={ad.id} />

      <div className="item-card">
        <h1 className="item-title">{ad.title}</h1>

        <div className="item-gallery">
          {ad.images && ad.images.length > 0 ? (
            ad.images.map((image, index) => {
              return (
                <img
                  loading="lazy"
                  style={{ margin: "0 1rem 0" }}
                  key={index}
                  src={image}
                  alt={`Изображение ${index + 1}`}
                  onError={(e) => e.target.src("default-image.jpg")}
                />
              );
            })
          ) : (
            <p>Изображений нет</p>
          )}
        </div>

        <br />

        <p className="item-description">{ad.description}</p>

        <br />

        <div className="item-characteristics">
          <table>
            <tbody>
              {Object.entries(ad.characteristics).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <br />

        <div className="item-seller">
          <p className="item-seller__name">{ad.seller.name}</p>
          <p className="item-seller__rating">{ad.seller.rating}</p>
          <p className="item-seller__adCount">{ad.seller.totalAds}</p>
          <p className="item-seller__dataOfRegistration">
            {new Date(ad.seller.registeredAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <br />

      <div className="moderation__container">
        <h2 className="moderation-title">
          <b>История модерации</b>
        </h2>
        <br />
        {moderationHistory.map((moderator, index) => (
          <div key={index}>
            <p>Проверил: {moderator.moderatorName}</p>
            <p>{new Date(moderator.timestamp).toLocaleDateString()}</p>

            <p>
              {moderator.action === "approved"
                ? "Одобрено"
                : moderator.action === "rejected"
                ? "Отклонено"
                : moderator.action === "requestChanges"
                ? "Запрос на доработку"
                : ""}
            </p>
            {moderator.action === "rejected" && (
              <div>
                <p>
                  Причина:{" "}
                  {moderator.comment ? moderator.comment : moderator.reason}
                </p>
              </div>
            )}

            <br />
          </div>
        ))}
      </div>

      <div className="navigate__container">
        <div className="navigation-buttons">
          <button onClick={handleToList}>К списку</button>
          <button onClick={handlePrevAd} disabled={currentAdIndex === 0}>
            Пред
          </button>
          <button
            onClick={handleNextAd}
            disabled={currentAdIndex === ads.length - 1}
          >
            След
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
