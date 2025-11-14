import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div>
      <p>
        {title}: {value}
      </p>
    </div>
  );
};

export default StatsCard;
