// src/components/SignUp.jsx

import React, { useState } from 'react';
import './SignUp.css';

/**
 * Sign Up Page Component (Fixed Navigation)
 * @param {object} props - Component props
 * @param {function} [props.navigate] - Page navigation handler (passed from App.jsx)
 */
const SignUp = ({ navigate }) => {
  // 상태 변수: 입력 필드와 정확히 매칭되어 입력 문제를 해결합니다.
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    // 폼 제출 시 페이지 새로고침 방지 (버튼 클릭 동작 보장)
    e.preventDefault();

    console.log('회원가입 시도:', { id, password, name, email });
    console.log('회원가입 성공. 홈 화면으로 이동합니다.'); 

    if (navigate) {
      // 메인 페이지로 이동 -> App.jsx에서 자동으로 로그인 모달 열림
      navigate('/'); 
    }
  };

  // '로그인' 링크 클릭 핸들러: 홈으로 이동
  const handleLoginClick = (e) => {
    e.preventDefault(); // 새로고침 방지 (링크 클릭 동작 보장)
    if (navigate) {
      navigate('/');
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-box">
        <h2>우주 탐험대원 등록</h2>
        <form onSubmit={handleSubmit}>
          
          {/* 1. 아이디 (필수) - value와 onChange로 제어 컴포넌트 패턴 적용 */}
          <div className="form-group">
            <label htmlFor="signup-id">아이디</label>
            <input
              type="text"
              id="signup-id"
              value={id}
              onChange={(e) => setId(e.target.value)} 
              required
              placeholder="사용하실 아이디를 입력하세요"
            />
          </div>

          {/* 2. 비밀번호 (필수) */}
          <div className="form-group">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          
          {/* 3. 닉네임 (필수) */}
          <div className="form-group">
            <label htmlFor="signup-name">닉네임</label>
            <input
              type="text"
              id="signup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="사용하실 닉네임을 입력하세요"
            />
          </div>
          
          {/* 4. 이메일 주소 (필수) */}
          <div className="form-group">
            <label htmlFor="signup-email">이메일 주소</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <button type="submit" className="signup-button">등록 완료</button>
        </form>
        
        <p className="login-link">
          이미 계정이 있으신가요? 
          <a href="#" onClick={handleLoginClick}>로그인</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;