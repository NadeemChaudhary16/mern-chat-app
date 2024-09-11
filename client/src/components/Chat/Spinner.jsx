import React from "react";

const Spiner = () => {
  return (
    <div className="mt-4 d-flex justify-content-center">
      <div
        className="spinner-border text-primary"
        style={{ width: "4rem", height: "4rem", fontSize: "2rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spiner;