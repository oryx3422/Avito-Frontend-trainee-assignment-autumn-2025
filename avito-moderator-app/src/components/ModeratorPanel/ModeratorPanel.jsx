import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./ModeratorPanel.css";
import MyButton from "../../UI/button/MyButton";

const ModeratorPanel_copy = ({ adId }) => {
  const navigate = useNavigate();
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const resetFields = () => {
    setAction("");
    setReason("");
    setComment("");
  };

  const notifySent = () => {
    setSuccessText("Отправлено");
    setTimeout(() => setSuccessText(""), 2000);
  };

  const refreshPage = () => {
    setTimeout(() => navigate(0), 500);
  };

  const validate = () => {
    if (!reason) {
      setErrorText("Выберите причину");
      return false;
    }
    if (reason === "Другое" && !comment.trim()) {
      setErrorText("Введите текст причины");
      return false;
    }
    setErrorText("");
    return true;
  };

  const handleApprove = async () => {
    setErrorText("");
    resetFields();

    try {
      setIsSending(true);
      await axios.post(`http://localhost:3001/api/v1/ads/${adId}/approve`);
      notifySent();
      refreshPage();
    } catch (err) {
      setErrorText("Ошибка отправки");
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = async () => {
    if (!validate()) return;

    try {
      setIsSending(true);
      await axios.post(`http://localhost:3001/api/v1/ads/${adId}/reject`, {
        reason,
        comment,
      });
      notifySent();
      
      resetFields();
      refreshPage();
    } catch (err) {
      setErrorText("Ошибка отправки");
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!validate()) return;

    try {
      setIsSending(true);
      await axios.post(
        `http://localhost:3001/api/v1/ads/${adId}/request-changes`,
        { reason, comment }
      );
      notifySent();
      resetFields();
      refreshPage();
    } catch (err) {
      setErrorText("Ошибка отправки");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="moderator-panel">
      <div className="moderator-panel__buttons">
        <MyButton
          disabled={isSending}
          onClick={handleApprove}
          style={{ background: "rgb(0,255,0,0.5)" }}
        >
          Одобрить
        </MyButton>

        <MyButton
          disabled={isSending}
          onClick={() => {
            setAction("reject");
            setErrorText("");
            setSuccessText("");
          }}
          style={{ background: "rgb(255,0,0,0.5)" }}
        >
          Отклонить
        </MyButton>

        <MyButton
          disabled={isSending}
          onClick={() => {
            setAction("requestChanges");
            setErrorText("");
            setSuccessText("");
          }}
          style={{ background: "rgb(255,255,0,0.5)" }}
        >
          Доработка
        </MyButton>
      </div>

      {isSending && <div className="loading">загрузка...</div>}

      {successText && <div className="success-msg">{successText}</div>}

      {errorText && <div className="error-msg">{errorText}</div>}

      {(action === "reject" || action === "requestChanges") && (
        <div className="moderator-panel__form">
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

          <button
            className="moderator-panel__submit"
            disabled={isSending}
            onClick={
              action === "reject" ? handleReject : handleRequestChanges
            }
          >
            Отправить
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeratorPanel_copy;
