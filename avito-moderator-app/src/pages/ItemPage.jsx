import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ItemPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  if (!ad) return <div>Объявление не найдено!</div>;

  return (
    <div className="item-page">
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
            {Object.entries(ad.characteristics).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
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
    </div>
  );
};

export default ItemPage;
