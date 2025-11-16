import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdCard from "../../components/adcard/AdCard";
import Pagination from "../../components/Pagination/Pagination.jsx";
import MySelect from "../../UI/select/MySelect";
import MyButton from "../../UI/button/MyButton";
import MyInput from "../../UI/input/MyInput";
import MyCheckbox from "../../UI/checkbox/MyCheckBox";
import Loader from "../../UI/Loader/Loader.jsx";
import "./ListPage.css";

const ListPage = () => {
  const { page } = useParams();
  const pageNum = Number(page) || 1;

  const [adsOrig, setAdsOrig] = useState([]);
  const [ads, setAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageNum);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSort, setSelectedSort] = useState("");
  const [filters, setFilters] = useState({
    statuses: [],
    categoryId: "",
    priceMin: "",
    priceMax: "",
    search: "",
  });

  const navigate = useNavigate();

  const fetchAllAdsForNavigation = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/ads", {
        params: { limit: 200 },
      });
      setAllAds(res.data.ads);
    } catch {}
  };

  const fetchAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/v1/ads", {
        params: { page, limit: 10 },
      });
      setAds(response.data.ads);
      setAdsOrig(response.data.ads);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных list: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdsForNavigation();
  }, []);

  useEffect(() => {
    setCurrentPage(pageNum);
  }, [pageNum]);

  useEffect(() => {
    if (
      filters.statuses.length > 0 ||
      filters.categoryId ||
      filters.priceMin ||
      filters.priceMax ||
      filters.search ||
      selectedSort
    ) {
      return;
    }

    fetchAds(currentPage);
  }, [currentPage]);

  const handleCLick = (ad) => {
    navigate(`/item/${ad.id}`, {
      state: { ads: allAds, page: pageNum },
    });
  };

  if (loading) return <div className="loading"><Loader /></div>;
  if (error) return <div className="error">{error}</div>;

  const applyFiltersAndSort = (sortValue, page = currentPage) => {
    let result = [...allAds];

    if (filters.statuses.length > 0) {
      result = result.filter((ad) => filters.statuses.includes(ad.status));
    }

    if (filters.categoryId) {
      result = result.filter((ad) => ad.categoryId === Number(filters.categoryId));
    }

    if (filters.priceMin !== "") {
      const min = Number(filters.priceMin);
      if (!Number.isNaN(min)) {
        result = result.filter((ad) => Number(ad.price) >= min);
      }
    }

    if (filters.priceMax !== "") {
      const max = Number(filters.priceMax);
      if (!Number.isNaN(max)) {
        result = result.filter((ad) => Number(ad.price) <= max);
      }
    }

    if (filters.search.trim() !== "") {
      const s = filters.search.toLowerCase();
      result = result.filter((ad) => ad.title.toLowerCase().includes(s));
    }

    const sort = sortValue || selectedSort;

    if (sort) {
      switch (sort) {
        case "priority": {
          const order = ["urgent", "normal"];
          result.sort(
            (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
          );
          break;
        }
        case "updated-new":
          result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case "updated-old":
          result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
          break;
        case "price-asc":
          result.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-desc":
          result.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        default:
          break;
      }
    }

    const pageSize = 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const safePage = page > totalPages ? 1 : page;

    const paginated = result.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize
    );

    setAds(paginated);
    setPagination({
      totalItems,
      totalPages,
      currentPage: safePage,
    });

    if (safePage !== currentPage) {
      navigate(`/list/${safePage}`);
    }
  };

  useEffect(() => {
    if (allAds.length > 0) {
      applyFiltersAndSort(selectedSort, currentPage);
    }
  }, [allAds]);

  const sortPosts = (sort) => {
    setSelectedSort(sort);
    applyFiltersAndSort(sort, 1);
  };

  const applyFilters = () => {
    applyFiltersAndSort(selectedSort, 1);
  };

  const resetFilters = () => {
    setFilters({
      statuses: [],
      categoryId: "",
      priceMin: "",
      priceMax: "",
      search: "",
    });
    setSelectedSort("");
    setAds(adsOrig);
  };

  const toggleCheckbox = (filterName, value) => {
    setFilters((prev) => {
      const list = prev[filterName];
      if (list.includes(value)) {
        return { ...prev, [filterName]: list.filter((v) => v !== value) };
      }
      return { ...prev, [filterName]: [...list, value] };
    });
  };

  return (
    <div className="list-container">
      <h1 className="ads-title">Объявления для вас </h1>

      <div className="ads-filter">
        <div className="ads-search">
          <MyInput
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            placeholder="Поиск по объявлениям"
            className="ads-search__input"
            type="text"
          />
        </div>

        <div className="filter-group">
          <MyCheckbox
            label="Ждет проверки"
            checked={filters.statuses.includes("pending")}
            onChange={() => toggleCheckbox("statuses", "pending")}
          />

          <MyCheckbox
            label="Одобрено"
            checked={filters.statuses.includes("approved")}
            onChange={() => toggleCheckbox("statuses", "approved")}
          />

          <MyCheckbox
            label="Отклонено"
            checked={filters.statuses.includes("rejected")}
            onChange={() => toggleCheckbox("statuses", "rejected")}
          />

          <MyCheckbox
            label="Доработка"
            checked={filters.statuses.includes("draft")}
            onChange={() => toggleCheckbox("statuses", "draft")}
          />

          <MySelect
            value={filters.categoryId}
            onChange={(value) =>
              setFilters({ ...filters, categoryId: value })
            }
            defaultValue="Категория"
            options={[
              { value: "", name: "Все" },
              { value: "1", name: "Недвижимость" },
              { value: "2", name: "Транспорт" },
              { value: "3", name: "Электроника" },
            ]}
          />
        </div>

        <MyInput
          type="number"
          placeholder="Минимальная цена"
          value={filters.priceMin}
          onChange={(e) =>
            setFilters({ ...filters, priceMin: e.target.value })
          }
        />

        <MyInput
          type="number"
          placeholder="Максимальная цена"
          value={filters.priceMax}
          onChange={(e) =>
            setFilters({ ...filters, priceMax: e.target.value })
          }
        />

        <MyButton onClick={applyFilters}>Применить</MyButton>
        <MyButton onClick={resetFilters}>Сбросить</MyButton>
      </div>

      <div className="ads-sort">
        <MySelect
          value={selectedSort}
          onChange={sortPosts}
          defaultValue="Сортировка"
          options={[
            { value: "default", name: "По умолчанию" },
            { value: "priority", name: "По приоритету" },
            { value: "updated-new", name: "Сначала новые" },
            { value: "updated-old", name: "Сначала старые" },
            { value: "price-asc", name: "Дешевле" },
            { value: "price-desc", name: "Дороже" },
          ]}
        />
      </div>

      <div className="ads-list">
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

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            applyFiltersAndSort(selectedSort, page)
          }
        />
      )}

      {pagination && (
        <p className="ads-totalItems">
          Всего объявлений: {pagination.totalItems}
        </p>
      )}
    </div>
  );
};

export default ListPage;
