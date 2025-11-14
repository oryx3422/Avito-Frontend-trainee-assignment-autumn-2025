import React, { useState } from "react";
import axios from "axios";

const ModeratorPanel_copy = ({ adId }) => {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSending(true);
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/approve`
      );
      console.log(`approve: ${response.data}`);
    } catch (err) {
      console.error(`approve: ${err} `);
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = async () => {
    if (!reason) {
      return;
    }

    try {
      setIsSending(true);
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/reject`,
        { reason, comment }
      );
      console.log(`reject: ${response.data}`);
    } catch (err) {
      console.error(`reject: ${err} `);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestChanges = async () => {
    try {
      setIsSending(true);
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/request-changes`,
        { reason, comment }
      );
      console.log(`request-changes: ${response.data}`);
    } catch (err) {
      console.error(`request-changes: ${err} `);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="moderator-panel">
      <button
        disabled={isSending}
        onClick={handleApprove}
        style={{ backgroundColor: "green" }}
      >
        Одобрить
      </button>
      <button
        disabled={isSending}
        onClick={handleReject}
        style={{ backgroundColor: "red" }}
      >
        Отклонить
      </button>
      <button
        disabled={isSending}
        onClick={handleRequestChanges}
        style={{ backgroundColor: "yellow" }}
      >
        Доработка
      </button>

      {isSending && <div className="loading">загрузка...</div>}

      <div>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Выберите причину</option>
          <option value="Запрещённый товар">Запрещённый товар</option>
          <option value="Неверная категория">Неверная категория</option>
          <option value="Некорректное описание">Некорректное описание</option>
          <option value="Проблемы с фото">Проблемы с фото</option>
          <option value="Подозрение на мошенничество">
            Подозрение на мошенничество
          </option>
          <option value="Другое">Другое</option>
        </select>

        {reason === "Другое" && (
          <input
            type="text"
            placeholder="Введите причину"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default ModeratorPanel_copy;
