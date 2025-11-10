// src/components/Login.jsx

import React, { useState } from 'react';
import './Login.css';

/**

로그인 모달 컴포넌트

@param {object} props - 컴포넌트 props

@param {boolean} props.isOpen - 모달 열림/닫힘 상태

@param {function} props.onClose - 모달 닫기 핸들러

@param {function} props.navigate - 페이지 이동을 처리하는 함수 (App.jsx에서 전달됨)
*/
const Login = ({ isOpen, onClose, navigate }) => {
const [id, setId] = useState('');
const [password, setPassword] = useState('');

if (!isOpen) return null;

const handleSubmit = (e) => {
e.preventDefault();
console.log('로그인 시도:', { id, password });
// TODO: 실제 로그인 로직 구현 (API 호출 등)
onClose(); // 로그인 시도 후 모달 닫기
};

const handleSignupClick = (e) => {
e.preventDefault();
onClose(); // 모달 닫기
if (navigate) {
navigate('/signup'); // 회원가입 페이지로 이동
}
};

return (
// 모달 배경 (클릭 시 닫기 기능 추가)
<div className="modal-overlay" onClick={onClose}>
{ /*모달내용 stopPropagation으로 배경 클릭 시 닫히는 것 방지*/ }
<div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
<button className="close-button" onClick={onClose}>×</button>
<h2>로그인</h2>
<form onSubmit={handleSubmit}>
<div className="form-group">
<label htmlFor="login-id">아이디</label>
<input
type="text"
id="login-id"
value={id}
onChange={(e) => setId(e.target.value)}
required
placeholder="아이디를 입력하세요"
/>
</div>
<div className="form-group">
<label htmlFor="login-password">비밀번호</label>
<input
type="password"
id="login-password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
placeholder="비밀번호를 입력하세요"
/>
</div>
<button type="submit" className="login-button">로그인</button>
</form>
<p className="signup-link">
계정이 없으신가요?
{/* navigate를 사용하여 페이지 이동 처리 */}
<a href="#" onClick={handleSignupClick}>회원가입</a>
</p>
</div>
</div>
);
};

export default Login;