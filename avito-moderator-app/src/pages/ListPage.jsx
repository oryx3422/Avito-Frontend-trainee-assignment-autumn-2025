// todo:
// filter
// edit route by pages: list => list/1 list/2 ... list/10
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdCard from "../components/AdCard";
import Pagination from "../components/pagination";

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

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <h1 className="ads-title">Объявления для вас </h1>
      <div className="ads-list">
        {ads.map((ad) => (
           <AdCard ad={ad} key={ad.id}/>
        ))}
      </div>

      <Pagination 
      currentPage={pagination.currentPage} 
      totalPages={pagination.totalPages}
      onPageChange={(page) => setCurrentPage(page)}
      />
      <p className="ads-totalItems">Всего объявлений: {pagination.totalItems}</p>

    </>
  );
};

export default ListPage;
