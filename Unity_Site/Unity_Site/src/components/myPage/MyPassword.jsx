import React, { useState } from "react";
import "./MyPassword.css";

const CONTEXT_PATH = "/MemorySpace";
const API_BASE = `${CONTEXT_PATH}/api`;

const MyPassword = ({ navigate, onLogout }) => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 🔹 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    // 🔹 실시간 비밀번호 일치 확인
    if (name === "confirmPassword") {
      if (value !== passwords.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "비밀번호가 일치하지 않습니다.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (name === "newPassword") {
      if (passwords.confirmPassword && value !== passwords.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "비밀번호가 일치하지 않습니다.",
        }));
      } else if (passwords.confirmPassword && value === passwords.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }

      // 비밀번호 유효성 검사 (선택사항)
      if (value.length > 0 && value.length < 4) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "비밀번호는 최소 4자 이상이어야 합니다.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }
    }
  };

  // 🔹 비밀번호 변경 처리
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // 유효성 검사
    if (!passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: "error", text: "모든 필드를 입력해주세요." });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "비밀번호가 일치하지 않습니다." });
      return;
    }

    if (passwords.newPassword.length < 4) {
      setMessage({ type: "error", text: "비밀번호는 최소 4자 이상이어야 합니다." });
      return;
    }

    setIsLoading(true);

    try {
      const body = `newPassword=${encodeURIComponent(passwords.newPassword)}`;

      const res = await fetch(`${API_BASE}/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      });

      const text = await res.text();
      const [status, message] = text.split("|");

      if (status === "SUCCESS") {
        // 🔹 세션 스토리지 클리어
        sessionStorage.removeItem("mypageVerified");
        alert("비밀번호가 변경되었습니다.\n다시 로그인해주세요.");
        // 로그아웃 처리 및 메인으로 이동
        if (onLogout) onLogout();
        if (navigate) navigate("/");
      } else {
        setMessage({ type: "error", text: message || "비밀번호 변경에 실패했습니다." });
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      setMessage({ type: "error", text: "서버 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 취소 버튼 (마이페이지로 돌아가기 - 비밀번호 확인 없이)
  const handleCancel = () => {
    if (navigate) {
      // 🔹 그냥 /mypage로 이동 (sessionStorage에 인증 상태 이미 저장되어 있음)
      navigate("/mypage");
    }
  };

  return (
    <div className="mypassword-container">
      <div className="mypassword-box">
        <h2 className="mypassword-title">비밀번호 변경</h2>
        <p className="mypassword-subtitle">
          새로운 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleChangePassword} className="mypassword-form">
          {/* 새 비밀번호 */}
          <div className="mypassword-input-group">
            <label htmlFor="newPassword">
              새 비밀번호 <span className="mypassword-required">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
              placeholder="새 비밀번호를 입력하세요"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="mypassword-error-text">{errors.newPassword}</p>
            )}
          </div>

          {/* 비밀번호 재확인 */}
          <div className="mypassword-input-group">
            <label htmlFor="confirmPassword">
              비밀번호 재확인 <span className="mypassword-required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mypassword-error-text">{errors.confirmPassword}</p>
            )}
            {!errors.confirmPassword &&
              passwords.confirmPassword &&
              passwords.newPassword === passwords.confirmPassword && (
                <p className="mypassword-success-text">
                  ✓ 비밀번호가 일치합니다.
                </p>
              )}
          </div>

          {/* 메시지 */}
          {message.text && (
            <div
              className={`mypassword-message ${
                message.type === "success"
                  ? "mypassword-message-success"
                  : "mypassword-message-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="mypassword-button-group">
            <button
              type="submit"
              className="mypassword-btn mypassword-btn-primary"
              disabled={
                isLoading ||
                !passwords.newPassword ||
                !passwords.confirmPassword ||
                passwords.newPassword !== passwords.confirmPassword
              }
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </button>

            <button
              type="button"
              className="mypassword-btn mypassword-btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPassword;