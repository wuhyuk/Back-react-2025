// manager/M_Main.jsx
import React from "react";
import "./M_Main.css";
import M_Header from "./M_Header";
import M_User from "./M_User";
import M_Decl from "./M_Decl";

function M_Main() {
  return (
    <div className="m-container">
      <M_Header />
      <div className="m-content-wrapper">
      <div className="m-dashboard">
        <div className="m-box">
          <h2>전체 회원 수</h2>
          <p>134 명</p>
        </div>

        <div className="m-box">
          <h2>저장 용량</h2>
          <p>사용됨: 2.4GB / 전체 10GB</p>
        </div>

        <div className="m-box">
          <h2>지역 분포</h2>
          <ul>
            <li>서울: 54명</li>
            <li>경기: 32명</li>
            <li>인천: 18명</li>
            <li>부산: 11명</li>
            <li>기타: 19명</li>
          </ul>
        </div>
      </div>

      {/* 회원 목록 */}
      <M_User />

      {/* 신고된 게시물 */}
      <M_Decl />
      </div>
    </div>
  );
}

export default M_Main;
