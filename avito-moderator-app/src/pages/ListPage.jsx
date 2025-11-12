// todo:
// edit route by pages: list => list/1 list/2 ... list/10
import axios from "axios";
import React, { useEffect, useState } from "react";

const ListPage = () => {

  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/v1/ads", {
        params: {
          page,
          limit: 10,
          status: ["approved", "pending"],
        },
      });
      setAds(response.data.ads);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage]);

  if (loading) return <>загрузка...</>; // todo: add loader
  if (error) return <>{error}</>;

  return (
    <>
      <h1>объявления</h1>
      <p>всего объявлений: {pagination.totalItems}</p>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id} style={{listStyle: 'none', background: '#ababab', width: '400px'}}>
            <h3>{ad.title}</h3>
            <p>Цена: <b>{ad.price}₽</b></p>
            <p>Категория: {ad.category}</p>
            <p>Дата создания: {new Date(ad.createdAt).toLocaleDateString()}</p>
            <p>Статус: {ad.status}</p>
            <p>Приоритет: {ad.priority}</p>
            <hr />
          </li>
        ))}
      </ul>

      <div>
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => setCurrentPage(pagination.currentPage - 1)}
        >
          предыдущая
        </button>
        <span>
          {pagination.currentPage} / {pagination.totalPages}
        </span>
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => setCurrentPage(pagination.currentPage + 1)}
        >
          следующая
        </button>
      </div>
    </>
  );
};

export default ListPage;
