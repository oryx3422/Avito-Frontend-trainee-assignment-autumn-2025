import React, { useState } from "react";
import axios from "axios";

const ModeratorPanel = ({ adId }) => {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showRejectButton, setShowRejectButton] = useState(false);

  const handleApprove = async () => {
    setAction("approved");
    setReason("");
    setCustomReason("");

    try {
      setIsSending(true);
      await postAdApprove(adId);
    } catch (err) {
      console.error(`approve error: ${err}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = async () => {
    setAction("rejected");
    setReason("");
    setCustomReason("");

    if (!reason) {
      console.log("not reason");
      return;
    }

    setShowRejectButton(true);

    try {
      setIsSending(true);
      const dataToSend = {
        reason: reason === "other" ? customReason : reason,
      };

      await postAdReject(adId, dataToSend);
    } catch (err) {
      console.error(`reject error: ${err}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestChanges = async () => {
    setAction("requestChanges");
    setReason("");
    setCustomReason("");

    try {
      setIsSending(true);
      const dataToSend = {
        status: "pending",
      };

      await postAdRequestChanges(adId, dataToSend);
    } catch (err) {
      console.error(`request-changes error: ${err}`);
    } finally {
      setIsSending(false);
    }
  };

  const postAdApprove = async (adId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/approve`
      );
      console.log("approve:", response.data);
    } catch (err) {
      console.error("approve error:", err);
    }
  };

  const postAdReject = async (adId, dataToSend) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/reject`,
        dataToSend
      );
      console.log("reject:", response.data);
    } catch (err) {
      console.error("reject error", err);
    }
  };

  const postAdRequestChanges = async (adId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/request-changes`
      );
      console.log("request-changes:", response.data);
    } catch (err) {
      console.error("request-changes error", err);
    }
  };

  const reasonText = {
    banItem: "Запрещённый товар",
    incorrectCategory: "Неверная категория",
    incorrectDescription: "Некорректное описание",
    incorrectPhoto: "Проблемы с фото",
    scam: "Подозрение на мошенничество",
    other: customReason,
  };

  const isSubmitDisabled =
    isSending ||
    (action === "rejected" && !reason) ||
    (action === "rejected" && reason === "other" && !customReason);

  return (
    <div className="moderation-actions">
      <button onClick={handleApprove} style={{ backgroundColor: "green" }}>
        Одобрить
      </button>
      <button onClick={handleReject} style={{ backgroundColor: "red" }}>
        Отклонить
      </button>
      <button
        onClick={handleRequestChanges}
        style={{ backgroundColor: "yellow" }}
      >
        Доработка
      </button>

      {action === "rejected" && (
        <div className="reason-container">
          <label>Укажите причину отклонения:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={customReason !== ""}
          >
            <option value="">Выберите причину</option>
            <option value="banItem">Запрещённый товар</option>
            <option value="incorrectCategory">Неверная категория</option>
            <option value="incorrectDescription">Некорректное описание</option>
            <option value="incorrectPhoto">Проблемы с фото</option>
            <option value="scam">Подозрение на мошенничество</option>
            <option value="other">Другое</option>
          </select>
          {reason === "other" && (
            <input
              type="text"
              placeholder="Введите вашу причину"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>
      )}
      {action && (
        <div>
          <h3>
            Вы выбрали действие:{" "}
            {action === "approved"
              ? "Одобрено"
              : action === "rejected"
              ? "Отклонено"
              : "Вернуть на доработку"}
          </h3>
          {reason && <p>Причина: {reasonText[reason]}</p>}
          <br />
        </div>
      )}

      <br />
    </div>
  );
};

export default ModeratorPanel;
