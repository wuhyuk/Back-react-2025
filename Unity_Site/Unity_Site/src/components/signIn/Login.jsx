// src/components/signIn/Login.jsx
import React, { useState, useEffect } from "react";
import "./Login.css";

// 메인에서 사용 중인 컨텍스트 경로와 동일하게 유지
const CONTEXT_PATH = "/MemorySpace";
const API_BASE = `${CONTEXT_PATH}/api`;

/**
 * 로그인 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.navigate
 * @param {function} props.onLoginSuccess  // ⭐ Main에서 내려주는 콜백
 */
const Login = ({ isOpen, onClose, navigate, onLoginSuccess }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // 모달이 닫힐 때마다 입력값 초기화
  useEffect(() => {
    if (!isOpen) {
      setId("");
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          id,
          password,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.success) {
        // ✅ 여기서 Main.jsx로 로그인 성공 알림 보내기
        //    data 안에 { success, userId, nickname, role } 들어있다고 가정
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }

        // 입력값 초기화 + 모달 닫기
        setId("");
        setPassword("");
        onClose();

        // ❌ 여기서 바로 navigate("/") 하면
        //    Main의 handleLoginSuccess가 관리하는 이동 로직(/manager)이 죽어버림
        //    → 페이지 이동은 Main.jsx에서만 처리
      } else {
        alert(data.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("로그인 요청 실패:", err);
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // "Don't have an account?" → Sign up 클릭 시 회원가입 화면으로 이동
  const handleSignupClick = (e) => {
    e.preventDefault();
    onClose(); // 모달 닫기
    if (navigate) {
      navigate("/signup");
    }
  };

  return (
    // 모달 오버레이 (배경)
    <div className="modal-overlay scrollable" onClick={onClose}>
      {/* 모달 박스 클릭 시에는 닫히지 않게 막기 */}
      <div
        className="login-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-id">ID</label>
            <input
              type="text"
              id="login-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              placeholder="Enter your ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* 🔥 기존 기능 유지: 회원가입 링크 */}
        <p className="signup-link">
          Don't have an account?{" "}
          <a href="#" onClick={handleSignupClick}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
