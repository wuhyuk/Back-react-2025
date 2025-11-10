// src/components/Header.jsx

import React from "react";
import "./Header.css";

/**
 * Header 컴포넌트
 * @param {object} props - 컴포넌트 props
 * @param {function} props.onLoginClick - 로그인 버튼 클릭 시 실행할 함수 (모달 열기)
 * @param {function} props.navigate - 페이지 이동을 처리하는 함수
 */
function Header({ onLoginClick, navigate }) {
  const handleLogoClick = () => {
    if (navigate) navigate('/');
  };

  const handleSignupClick = () => {
    if (navigate) navigate('/signup');
  };

  return (
    <header className="header">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="logo" onClick={handleLogoClick}>Memory Space</div>
      <div className="auth-buttons">
        {/* 로그인 버튼 클릭 시 모달 열기 함수 실행 */}
        <button className="login-btn" onClick={onLoginClick}>로그인</button>
        {/* 회원가입 버튼 클릭 시 /signup 경로로 이동 함수 실행 */}
        <button className="signup-btn" onClick={handleSignupClick}>회원가입</button>
      </div>
    </header>
  );
}

export default Header;