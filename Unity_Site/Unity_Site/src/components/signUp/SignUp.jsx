// src/components/SignUp.jsx
import React, { useState } from 'react';
import './SignUp.css';
import BlackHole from '../blackHelo/BlackHole';

const CONTEXT_PATH = '/MemorySpace';
const API_BASE = `${CONTEXT_PATH}/api`;

const SignUp = ({ navigate }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // 이메일 ID / 도메인 분리
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [region, setRegion] = useState('');

  // 도메인 선택 옵션
  const domainOptions = [
    'ENTER MANUALLY',
    'gmail.com',
    'naver.com',
    'daum.net',
    'hanmail.net',
    'kakao.com',
  ];

  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain === 'ENTER MANUALLY') {
      setEmailDomain('');
    } else {
      setEmailDomain(selectedDomain);
    }
  };

  // 🔥 실제 회원가입 서블릿 호출
  const handleSubmit = async (e) => {
      e.preventDefault();

      const fullEmail = `${emailId}@${emailDomain}`;

      try {
        const response = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: new URLSearchParams({
            id,
            password,
            name,
            email: fullEmail,
            region,
          }).toString(),
        });

        if (!response.ok) throw new Error('Server error');

        const data = await response.json();

        if (data.success) {
          alert('회원가입이 완료되었습니다. 이제 로그인해 주세요.');
          if (navigate) {
            // 메인으로 이동 + 로그인 모달 열기
            navigate('/', { openLogin: true });
          }
        } else {
          alert(data.message || '회원가입에 실패했습니다.');
        }
      } catch (err) {
        console.error('회원가입 요청 실패:', err);
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

  return (
    <div className="signup-page-root scrollable">
      <BlackHole />

      <div className="signup-page-container">
        <div className="signup-form-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-id">ID</label>
              <input
                type="text"
                id="signup-id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                placeholder="Please enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">PASSWORD</label>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Please enter your password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-name">NICKNAME</label>
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Please enter your nickname"
              />
            </div>

            {/* 이메일 2단 분할 + 도메인 선택 */}
            <div className="form-group">
              <label>EMAIL</label>
              <div className="email-input-group">
                <input
                  type="text"
                  id="signup-email-id"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                  placeholder="Email ID"
                  className="email-id-input"
                />
                <span className="at-symbol">@</span>

                <input
                  type="text"
                  id="signup-email-domain-input"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  required
                  placeholder="Input domain"
                  disabled={
                    domainOptions.includes(emailDomain) &&
                    emailDomain !== 'ENTER MANUALLY'
                  }
                  className="email-domain-input"
                />

                <select
                  id="signup-email-domain-select"
                  onChange={handleDomainChange}
                  value={
                    domainOptions.includes(emailDomain)
                      ? emailDomain
                      : 'ENTER MANUALLY'
                  }
                  className="email-domain-select"
                >
                  {domainOptions.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 지역 선택 */}
            <div className="form-group">
              <label htmlFor="signup-region">REGION YOU LIVE IN</label>
              <select
                id="signup-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              >
                <option value="">SELECT REGION</option>
                <option value="서울">서울</option>
                <option value="경기도">경기도</option>
                <option value="인천">인천</option>
                <option value="강원도">강원도</option>
                <option value="충청북도">충청북도</option>
                <option value="충청남도">충청남도</option>
                <option value="경상북도">경상북도</option>
                <option value="경상남도">경상남도</option>
                <option value="전라북도">전라북도</option>
                <option value="전라남도">전라남도</option>
                <option value="제주도">제주도</option>
              </select>
            </div>

            <button type="submit" className="signup-button">
              Create account
            </button>
          </form>

          {/* 원하면 아래 같이 "로그인으로 돌아가기" 버튼도 추가 가능 */}
          {/* <p className="login-link">
            Already have an account?
            <a href="#" onClick={handleLoginClick}>Sign in</a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
