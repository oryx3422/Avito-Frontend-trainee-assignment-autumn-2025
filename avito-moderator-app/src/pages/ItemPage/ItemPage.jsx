// decompose

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ModeratorPanel from "../../components/ModeratorPanel/ModeratorPanel.jsx";
import ItemNavigate from "../../components/ItemNavigate.jsx";

import Loader from "../../UI/Loader/Loader.jsx";

import './ItemPage.css'


const ItemPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const page = location.state?.page || 1;
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const ads = location.state?.ads || [];


  // useEffect(() => {
  //   // console.log(`ads: ${ads}`);
  //   if (ads && ads.length > 0) {
  //     const currentAd = ads.find((ad) => ad.id === parseInt(id));
  //     // console.log(`ad:', ${JSON.stringify(currentAd, null, 2)}`);
  //     setAd(currentAd);
  //     const index = ads.findIndex((ad) => ad.id === parseInt(id));
  //     setCurrentAdIndex(index);
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //     setError("Объявление не найдено!");
  //   }
  // }, [id, ads]);

  useEffect(() => {
  if (ads.length > 0) {
    const index = ads.findIndex(a => a.id === Number(id));
    setCurrentAdIndex(index === -1 ? 0 : index);
  }
}, [id, ads]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/v1/ads/${id}`
      );
      setAd(response.data);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const handleToList = () => {
    console.log(`navigate to list`);
    navigate(`/list/${page}`);
  };

const handlePrevAd = () => {
  if (currentAdIndex <= 0) return;
  const prevAd = ads[currentAdIndex - 1];
  navigate(`/item/${prevAd.id}`, { state: { ads, page  } });
};


const handleNextAd = () => {
  if (currentAdIndex >= ads.length - 1) return;
  const nextAd = ads[currentAdIndex + 1];
  navigate(`/item/${nextAd.id}`, { state: { ads, page } });
};


  if (loading) return <div className="loading"><Loader /></div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  if (!ad) return <div>Объявление не найдено!</div>;

  const moderationHistory = [...ad.moderationHistory].reverse();

  return (
    <div className="item-page">
      <ModeratorPanel adId={ad.id} />
      <ItemNavigate 
        onToList={handleToList}
  onPrev={handlePrevAd}
  onNext={handleNextAd}
  disablePrev={currentAdIndex === 0}
  disableNext={currentAdIndex === ads.length - 1}/>

      <div className="item-card">
        <h1 className="item-title">{ad.title}</h1>

        <div className="item-gallery">
          {ad.images && ad.images.length > 0 ? (
            ad.images.map((image, index) => {
              return (
                <img
                  loading="lazy"
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
          <p className="item-seller__name">Продавец: {ad.seller.name}</p>
          <p className="item-seller__rating">Рейтинг: {ad.seller.rating}</p>
          <p className="item-seller__adCount">
            {ad.seller.totalAds} объявлений
          </p>
          <p className="item-seller__dataOfRegistration">
            На сайте с {new Date(ad.seller.registeredAt).toLocaleDateString()}
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
            <p>{new Date(moderator.timestamp).toLocaleString("ru-RU", {})}</p>

            <p>
              {moderator.action === "approved"
                ? "Одобрено"
                : moderator.action === "rejected"
                ? "Отклонено"
                : moderator.action === "requestChanges"
                ? "Доработка"
                : ""}
            </p>
            {moderator.action !== "approved" && (
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

      {/* <div className="navigate__container">
        <div className="navigation-buttons">
          <MyButton onClick={handleToList}>К списку</MyButton>
          <MyButton onClick={handlePrevAd} disabled={currentAdIndex === 0}>
            Пред
          </MyButton>
          <MyButton
            onClick={handleNextAd}
            disabled={currentAdIndex === ads.length - 1}
          >
            След
          </MyButton>
        </div>
      </div> */}

        <ItemNavigate 
        onToList={handleToList}
  onPrev={handlePrevAd}
  onNext={handleNextAd}
  disablePrev={currentAdIndex === 0}
  disableNext={currentAdIndex === ads.length - 1}/>

    </div>
  );
};

export default ItemPage;
