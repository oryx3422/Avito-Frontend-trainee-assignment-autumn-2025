// todo:
// filter
// edit route by pages: list => list/1 list/2 ... list/10

// навигация работает только на объявления, которые в списке limit:

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdCard from "../components/AdCard";
import Pagination from "../components/pagination";
import MySelect from "../UI/select/MySelect";

const ListPage = () => {
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSort, setSelectedSort] = useState("default");

  const navigate = useNavigate();

  const fetchAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/v1/ads", {
        params: {
          page,
          limit: 10,
          // status: ["approved"],
        },
      });
      setAds(response.data.ads);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных list: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage]);

  const handleCLick = (ad) => {
    console.log("navigate to ad.id:", ad.id);
    navigate(`/item/${ad.id}`, {
      state: { ads },
    });
  };

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  const sortPosts = (sort) => {
    setSelectedSort(sort);
    console.log(sort);

    const sorted = [...ads];

    switch (sort) {
      case "default":
        fetchAds(1);
        return;

      case "priotiry":
        sorted.sort((a, b) => {
          const order = ["urgent", "normal"];
          return order.indexOf(a.priority) - order.indexOf(b.priority);
        });
        break;

      case "updated-new":
        sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;

      case "updated-old":
        sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;

      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    setAds(sorted);
  };

  return (
    <>
      <h1 className="ads-title">Объявления для вас </h1>
      <MySelect
        value={selectedSort}
        onChange={sortPosts}
        defaultValue="Сортировка"
        options={[
          { value: "default", name: "По умолчанию" },
          { value: "priotiry", name: "По приоритету" },
          { value: "updated-new", name: "Сначала новые" },
          { value: "updated-old", name: "Сначала старые" },
          { value: "price-asc", name: "Дешевле" },
          { value: "price-desc", name: "Дороже" },
        ]}
      />
      <div className="ads-list">
        <hr />

        {ads.map((ad) => (
          <div
            className="add-card__container"
            key={ad.id}
            onClick={() => handleCLick(ad)}
          >
            <AdCard ad={ad} key={ad.id} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <p className="ads-totalItems">
        Всего объявлений: {pagination.totalItems}
      </p>
    </>
  );
};

export default ListPage;
