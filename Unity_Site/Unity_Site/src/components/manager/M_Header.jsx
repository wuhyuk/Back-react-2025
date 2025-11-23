// manager/M_Header.jsx
import React from "react";
import "./M_Header.css";

function M_Header() {
  return (
    <header className="m-header">
      <div className="m-logo">Manager</div>
      <button className="m-logout">로그아웃</button>
    </header>
  );
}

export default M_Header;
