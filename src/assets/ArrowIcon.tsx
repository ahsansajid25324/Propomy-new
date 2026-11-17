import React from "react";

const ArrowIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="currentColor"
    className={`bi bi-arrow-up-right ${className || ""}`}
    viewBox="0 0 14 14"
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
    />
  </svg>
);

export default ArrowIcon;
