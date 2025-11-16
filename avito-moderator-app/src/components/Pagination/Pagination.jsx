import React from "react";
import MyButton from "../../UI/button/MyButton";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <div className={`pagination-container ${className || ""}`}>
      <MyButton
        className="pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </MyButton>

      <span>
        {currentPage} / {totalPages}
      </span>

      <MyButton
        className="pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </MyButton>
    </div>
  );
};

export default Pagination;
