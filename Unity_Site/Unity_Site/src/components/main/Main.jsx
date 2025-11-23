import React, { useState, useCallback, useEffect } from "react";
import "./Main.css";

import Header from "../header/Header";
import Login from "../signIn/Login";
import SignUp from "../signUp/SignUp";
import SpaceBackground from "../background/SpaceBackground";
import M_Main from "../manager/M_Main";
import Introduction from "../etcView/Introduction";
import Tutorial from "../etcView/Tutorial";
import Example from "../etcView/Example";
import Inquiries from "../etcView/Inquiries";

// 🔹 MapPage 임포트
import MapPage from "../map/MapPage"; 
// 🔹 MyPage 임포트
import MyPage from "../myPage/MyPage";
// 🔹 MyPassword 임포트
import MyPassword from "../myPage/MyPassword";


const CONTEXT_PATH = "/MemorySpace";
// ✅ API 공통 prefix
const API_BASE = `${CONTEXT_PATH}/api`;

// 실제 URL(/MemorySpace/...) → 논리 경로(/, /signup, /manager, /inquiries...)
const stripContextPath = (pathname) => {
  if (!pathname.startsWith(CONTEXT_PATH)) return pathname || "/";
  let stripped = pathname.slice(CONTEXT_PATH.length);
  if (stripped === "" || stripped === "/" || stripped === "/index.html") {
    return "/";
  }
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
};

// ✅ 관리자 페이지 래퍼 (M_Main 감싸기)
const ManagerPage = ({ nickname }) => {
  return <M_Main nickname={nickname} />;
};

const Main = () => {
  // ⭐ 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 로그인 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 현재 페이지 (논리 경로 기준)
  const initialPath = stripContextPath(window.location.pathname || "/");
  const [currentPage, setCurrentPage] = useState(initialPath);

  // 🔹 현재 페이지가 MapPage인지 Header에 전달하기 위한 상태
  const isMapPage = currentPage === "/map"; 

  const handleOpenLogin = () => setIsLoginModalOpen(true);
  const handleCloseLogin = () => setIsLoginModalOpen(false);

  // ✅ 로그인 성공 시 (Login.jsx → Main.jsx로 data 넘겨줌)
  //    data 예: { success:true, userId:"", nickname:"", role:"ADMIN" }
  const handleLoginSuccess = (data) => {
    const displayName = data.nickname || data.userId || "";
    const adminFlag = data.role === "ADMIN";

    setIsLoggedIn(true);
    setNickname(displayName);
    setIsAdmin(adminFlag);

    // 관리자면 /manager, 일반 유저면 /
    if (adminFlag) {
      navigate("/manager");
    } else {
      navigate("/");
    }
  };

  // ✅ 로그아웃 (Header에서 호출)
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("로그아웃 요청 실패:", e);
    } finally {
      setIsLoggedIn(false);
      setNickname("");
      setIsAdmin(false);
      setIsLoginModalOpen(false);

      // 🔹 세션 스토리지 클리어
      sessionStorage.removeItem("mypageVerified");

      // 로그아웃 후 항상 홈으로
      const logicalPath = "/";
      const fullPath = `${CONTEXT_PATH}/index.html`;
      window.history.pushState({}, "", fullPath);
      setCurrentPage(logicalPath);
    }
  };

  // ✅ 새로고침 시 서버 세션 기준으로 로그인 상태 복원
  useEffect(() => {
    const checkAuth = async () => {
      const logicalPathNow = stripContextPath(
        window.location.pathname || "/"
      );

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        // 서버에서 401/403 등 → 비로그인 상태로 처리
        if (!res.ok) {
          setIsLoggedIn(false);
          setNickname("");
          setIsAdmin(false);

          // 🔹 세션 스토리지 클리어
          sessionStorage.removeItem("mypageVerified");

          // 비로그인인데 접근 제한 페이지로 직접 들어온 경우 → 홈으로 강제 이동
          if (logicalPathNow === "/manager" || logicalPathNow === "/map" || logicalPathNow === "/mypage" || logicalPathNow === "/mypassword") {
            const fullPath = `${CONTEXT_PATH}/index.html`;
            window.history.replaceState({}, "", fullPath);
            setCurrentPage("/");
          } else {
            setCurrentPage(logicalPathNow);
          }
          return;
        }

        const data = await res.json();

        if (data.loggedIn) {
          const adminFlag = data.role === "ADMIN";

          setIsLoggedIn(true);
          setNickname(data.nickname || data.userId || "");
          setIsAdmin(adminFlag);

          // 일반 유저가 /manager 로딩한 경우 → 홈으로
          if (logicalPathNow === "/manager" && !adminFlag) {
            const fullPath = `${CONTEXT_PATH}/index.html`;
            window.history.replaceState({}, "", fullPath);
            setCurrentPage("/");
          } else {
            setCurrentPage(logicalPathNow);
          }
        } else {
          // loggedIn === false
          setIsLoggedIn(false);
          setNickname("");
          setIsAdmin(false);

          // 🔹 세션 스토리지 클리어
          sessionStorage.removeItem("mypageVerified");

          // 비로그인인데 접근 제한 페이지로 직접 들어온 경우 → 홈으로 강제 이동
          if (logicalPathNow === "/manager" || logicalPathNow === "/map" || logicalPathNow === "/mypage" || logicalPathNow === "/mypassword") {
            const fullPath = `${CONTEXT_PATH}/index.html`;
            window.history.replaceState({}, "", fullPath);
            setCurrentPage("/");
          } else {
            setCurrentPage(logicalPathNow);
          }
        }
      } catch (e) {
        console.error("로그인 상태 확인 실패:", e);
        // 네트워크 에러 등일 때도 일단 비로그인 취급
        setIsLoggedIn(false);
        setNickname("");
        setIsAdmin(false);

        // 🔹 세션 스토리지 클리어
        sessionStorage.removeItem("mypageVerified");

        // 네트워크 에러 시에도 제한 페이지면 홈으로 이동
        if (logicalPathNow === "/manager" || logicalPathNow === "/map" || logicalPathNow === "/mypage" || logicalPathNow === "/mypassword") {
          const fullPath = `${CONTEXT_PATH}/index.html`;
          window.history.replaceState({}, "", fullPath);
          setCurrentPage("/");
        } else {
          setCurrentPage(logicalPathNow);
        }
      }
    };

    checkAuth();
  }, []);

  // ✅ SPA 내 네비게이션 함수
  const navigate = useCallback((path, options = {}) => {
    const logicalPath = path.startsWith("/") ? path : `/${path}`;
    const fullPath =
      logicalPath === "/"
        ? `${CONTEXT_PATH}/index.html`
        : `${CONTEXT_PATH}${logicalPath}`;

    window.history.pushState({}, "", fullPath);
    setCurrentPage(logicalPath);

    if (options.openLogin) setIsLoginModalOpen(true);
    else setIsLoginModalOpen(false);
  }, []);

  // 🔁 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      const pathname = stripContextPath(window.location.pathname);

      // 뒤로가기 등으로 접근 제한 페이지 왔는데 권한 없으면 홈으로
      if ((pathname === "/manager" && !isAdmin) || 
          ((pathname === "/map" || pathname === "/mypage" || pathname === "/mypassword") && !isLoggedIn)) {
        const fullPath = `${CONTEXT_PATH}/index.html`;
        window.history.replaceState({}, "", fullPath);
        setCurrentPage("/");
      } else {
        setCurrentPage(pathname);
      }

      setIsLoginModalOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAdmin, isLoggedIn]);

  // ✅ 현재 페이지에 맞는 콘텐츠 렌더링
  const renderContent = () => {
    switch (currentPage) {
      case "/signup":
        return <SignUp navigate={navigate} />;

      case "/manager":
        return <ManagerPage nickname={nickname} />;
      
      // 🔹 MapPage 렌더링 (로그인 필요 페이지)
      case "/map":
        if (!isLoggedIn) { 
          navigate("/");
          return null;
        }
        return <MapPage />;
      
      // 🔹 MyPage 렌더링 (로그인 필요 페이지)
      case "/mypage":
        if (!isLoggedIn) {
          handleOpenLogin();
          navigate("/");
          return null;
        }
        return <MyPage navigate={navigate} onLogout={handleLogout} />;
      
      // 🔹 MyPassword 렌더링 (로그인 필요 페이지)
      case "/mypassword":
        if (!isLoggedIn) {
          handleOpenLogin();
          navigate("/");
          return null;
        }
        return <MyPassword navigate={navigate} onLogout={handleLogout} />;
        
      // ⭐ 큰 별로 들어가는 4개 페이지
      case "/introduction":
        return <Introduction />;

      case "/tutorial":
        return <Tutorial />;

      case "/example":
        return <Example />;

      case "/inquiries":
        return <Inquiries />;

      case "/":
      default:
        // ⭐ 메인에서만 우주 SpaceBackground 렌더
        return (
          <main className="main-wrapper">
            <SpaceBackground navigate={navigate} />
          </main>
        );
    }
  };

  return (
    <div className="app-root">
      {/* 관리자 페이지(/manager)일 때는 Header 숨김 */}
      {currentPage !== "/manager" && (
        <Header
          onLoginClick={handleOpenLogin}
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          nickname={nickname}
          onLogout={handleLogout}
          isMapPage={isMapPage}
        />
      )}

      {renderContent()}

      {/* 로그인 모달 */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        navigate={navigate}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Main;