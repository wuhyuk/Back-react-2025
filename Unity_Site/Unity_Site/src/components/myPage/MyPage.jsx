import React, { useState, useEffect } from "react";
import "./MyPage.css";

const CONTEXT_PATH = "/MemorySpace";
const API_BASE = `${CONTEXT_PATH}/api`;

const MyPage = ({ navigate, onLogout }) => {
  // 🔹 비밀번호 확인 단계
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");

  // 🔹 사용자 정보
  const [userInfo, setUserInfo] = useState({
    username: "",
    nickname: "",
    email: "",
    liveIn: "",
  });

  // 🔹 수정할 정보
  const [editInfo, setEditInfo] = useState({
    nickname: "",
    email: "",
    liveIn: "",
  });

  // 🔹 회원 탈퇴 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔹 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 메시지
  const [message, setMessage] = useState({ type: "", text: "" });

  // 🔹 컴포넌트 마운트 시 sessionStorage 체크
  useEffect(() => {
    const verified = sessionStorage.getItem("mypageVerified");
    if (verified === "true") {
      setIsVerified(true);
      fetchUserInfo();
    }
  }, []);

  // 🔹 비밀번호 확인 처리
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `password=${encodeURIComponent(verifyPassword)}`,
      });

      const text = await res.text();
      const [status, message] = text.split("|");

      if (status === "SUCCESS") {
        setIsVerified(true);
        // 🔹 세션 스토리지에 인증 상태 저장
        sessionStorage.setItem("mypageVerified", "true");
        // 사용자 정보 불러오기
        fetchUserInfo();
      } else {
        setVerifyError(message || "비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 실패:", error);
      setVerifyError("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 사용자 정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/info`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("사용자 정보를 불러올 수 없습니다.");
      }

      const text = await res.text();
      const [status, username, nickname, email, liveIn] = text.split("|");

      if (status === "SUCCESS") {
        setUserInfo({
          username: username || "",
          nickname: nickname || "",
          email: email || "",
          liveIn: liveIn || "",
        });
        setEditInfo({
          nickname: nickname || "",
          email: email || "",
          liveIn: liveIn || "",
        });
      }
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
      setMessage({ type: "error", text: "사용자 정보를 불러올 수 없습니다." });
    }
  };

  // 🔹 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 회원정보 수정
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    if (!editInfo.nickname || !editInfo.email) {
      setMessage({ type: "error", text: "필수 항목을 입력해주세요." });
      setIsLoading(false);
      return;
    }

    try {
      const body = `nickname=${encodeURIComponent(editInfo.nickname)}&email=${encodeURIComponent(editInfo.email)}&liveIn=${encodeURIComponent(editInfo.liveIn)}`;
      
      const res = await fetch(`${API_BASE}/user/update`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      });

      const text = await res.text();
      const [status, message] = text.split("|");

      if (status === "SUCCESS") {
        setMessage({ type: "success", text: "회원정보가 수정되었습니다." });
        setUserInfo((prev) => ({ ...prev, ...editInfo }));
      } else {
        setMessage({ type: "error", text: message || "수정에 실패했습니다." });
      }
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
      setMessage({ type: "error", text: "서버 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/delete`, {
        method: "POST",
      });

      const text = await res.text();
      const [status, message] = text.split("|");

      if (status === "SUCCESS") {
        // 🔹 세션 스토리지 클리어
        sessionStorage.removeItem("mypageVerified");
        alert("회원 탈퇴가 완료되었습니다.");
        // 로그아웃 처리 및 메인으로 이동
        if (onLogout) onLogout();
        if (navigate) navigate("/");
      } else {
        alert(message || "회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  // 🔹 비밀번호 변경 페이지로 이동
  const handleChangePassword = () => {
    if (navigate) navigate("/mypassword");
  };

  // 🔹 비밀번호 확인 화면
  if (!isVerified) {
    return (
      <div className="mypage-container">
        <div className="mypage-verify-box">
          <h2 className="mypage-title">비밀번호 확인</h2>
          <p className="mypage-subtitle">
            회원정보를 보호하기 위해 비밀번호를 다시 한 번 입력해주세요.
          </p>

          <form onSubmit={handleVerifyPassword} className="mypage-verify-form">
            <div className="mypage-input-group">
              <label htmlFor="verifyPassword">비밀번호</label>
              <input
                type="password"
                id="verifyPassword"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
              {verifyError && (
                <p className="mypage-error-text">{verifyError}</p>
              )}
            </div>

            <button
              type="submit"
              className="mypage-btn mypage-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "확인 중..." : "확인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 🔹 회원정보 수정 화면
  return (
    <div className="mypage-container">
      <div className="mypage-content-box">
        {/* 🔹 헤더: 타이틀 + 비밀번호 변경 버튼 */}
        <div className="mypage-header">
          <h2 className="mypage-title">마이페이지</h2>
          <button
            className="mypage-change-password-btn"
            onClick={handleChangePassword}
          >
            비밀번호 변경
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="mypage-form">
          {/* 아이디 (수정 불가) */}
          <div className="mypage-input-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={userInfo.username}
              disabled
              className="mypage-input-disabled"
            />
          </div>

          {/* 닉네임 */}
          <div className="mypage-input-group">
            <label htmlFor="nickname">
              닉네임 <span className="mypage-required">*</span>
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={editInfo.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
              disabled={isLoading}
            />
          </div>

          {/* 이메일 */}
          <div className="mypage-input-group">
            <label htmlFor="email">
              이메일 <span className="mypage-required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editInfo.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
            />
          </div>

          {/* 거주지 */}
          <div className="mypage-input-group">
            <label htmlFor="liveIn">거주지</label>
            <input
              type="text"
              id="liveIn"
              name="liveIn"
              value={editInfo.liveIn}
              onChange={handleInputChange}
              placeholder="거주지를 입력하세요 (선택)"
              disabled={isLoading}
            />
          </div>

          {/* 메시지 */}
          {message.text && (
            <div
              className={`mypage-message ${
                message.type === "success"
                  ? "mypage-message-success"
                  : "mypage-message-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="mypage-button-group">
            <button
              type="submit"
              className="mypage-btn mypage-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "수정 중..." : "회원정보 수정"}
            </button>

            <button
              type="button"
              className="mypage-btn mypage-btn-danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
            >
              회원 탈퇴
            </button>
          </div>
        </form>
      </div>

      {/* 🔹 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="mypage-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="mypage-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="mypage-modal-title">회원 탈퇴</h3>
            <p className="mypage-modal-text">
              정말 회원을 탈퇴하시겠습니까?
              <br />
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>

            <div className="mypage-modal-buttons">
              <button
                className="mypage-btn mypage-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                아니오
              </button>
              <button
                className="mypage-btn mypage-btn-danger"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;