import React from "react";

import "./Button.css";

export const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  );
};
