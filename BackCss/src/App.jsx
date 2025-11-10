// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(window.location.pathname);

const handleOpenLogin = () => setIsLoginModalOpen(true);
const handleCloseLogin = () => setIsLoginModalOpen(false);

// 페이지 이동 함수
const navigate = useCallback((path) => {
window.history.pushState({}, '', path);
setCurrentPage(path);

// 핵심 수정: 메인 페이지로 이동 시 로그인 모달을 열도록 처리
if (path === '/') {
handleOpenLogin();
} else if (isLoginModalOpen) {
// 다른 페이지로 이동 시 모달은 닫아줍니다.
handleCloseLogin();
}
}, [isLoginModalOpen]);

// 브라우저 뒤로가기/앞으로 가기 시 페이지 상태 업데이트
useEffect(() => {
const handlePopState = () => {
const newPath = window.location.pathname;
setCurrentPage(newPath);

// 뒤로가기/앞으로가기로 메인 페이지에 도착했을 때도 모달을 열어줍니다.
if (newPath === '/') {
  handleOpenLogin();
} else {
  handleCloseLogin();
}


};
window.addEventListener('popstate', handlePopState);
return () => window.removeEventListener('popstate', handlePopState);
}, []); // 의존성 배열을 비워 최초 한 번만 이벤트 리스너가 등록되도록 합니다.

const renderContent = () => {
switch (currentPage) {
case '/signup':
// SignUp 컴포넌트에 navigate 함수를 전달합니다.
return <SignUp navigate={navigate} />;
case '/':
default:
return (
<div className="main-content">
<h1>🌌 우주 공간 탐험을 시작하세요 🌠</h1>
<p>로그인 후, 미지의 세계를 탐색할 수 있습니다.</p>
</div>
);
}
};

return (

<div className="app-container">
<Header
onLoginClick={handleOpenLogin}
navigate={navigate}
/>
{renderContent()}
<Login
isOpen={isLoginModalOpen}
onClose={handleCloseLogin}
navigate={navigate} // Login 컴포넌트에 navigate를 전달하여 회원가입 이동을 처리
/>
</div>
);
}

export default App;