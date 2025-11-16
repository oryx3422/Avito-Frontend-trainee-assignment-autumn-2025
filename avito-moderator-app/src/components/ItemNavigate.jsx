import React from "react";
import MyButton from "../../src/UI/button/MyButton";

const ItemNavigation = ({ onToList, onPrev, onNext, disablePrev, disableNext }) => {
  return (
    <div className="navigate__container">
      <div className="navigation-buttons">
        <MyButton onClick={onToList}>К списку</MyButton>

        <MyButton onClick={onPrev} disabled={disablePrev}>
          Пред
        </MyButton>

        <MyButton onClick={onNext} disabled={disableNext}>
          След
        </MyButton>
      </div>
    </div>
  );
};

export default ItemNavigation;
