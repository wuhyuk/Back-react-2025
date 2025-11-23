// src/components/etcView/Tutorial.jsx
import React from 'react';
import './Tutorial.css';

function Tutorial() {
  return (
    <div className="tutorial-page-wrapper scrollable">
      <main className="tutorial-main-content">
        <div className="tutorial-container">
          <h1 className="page-title">
            '별의 기록자' 사용 튜토리얼
          </h1>

          {/* 1. 시작 가이드 */}
          <section className="section-card">
            <h2>1. 회원가입 & 로그인</h2>
            <ul className="tutorial-list">
              <li>상단 메뉴의 <strong>Sign Up</strong> 버튼을 눌러 회원가입을 진행합니다.</li>
              <li>아이디, 비밀번호, 닉네임, 이메일, 거주 지역을 입력해 계정을 생성합니다.</li>
              <li>가입 후 <strong>Sign In</strong> 버튼으로 로그인하면 나만의 우주가 활성화됩니다.</li>
            </ul>
          </section>

          {/* 2. 행성 & 별 생성 */}
          <section className="section-card">
            <h2>2. 행성과 별 만들기</h2>
            <ul className="tutorial-list">
              <li>메인 화면에서 보이는 우주에서, 주제를 정해 <strong>행성(Planet)</strong>을 생성합니다.</li>
              <li>각 행성에는 추억, 사진, 영상, 글 등을 <strong>별(Star)</strong> 형태로 추가할 수 있습니다.</li>
              <li>별에 태그를 달아두면, 나중에 같은 태그별로 모아서 볼 수 있습니다.</li>
            </ul>
          </section>

          {/* 3. 태그 & 검색 */}
          <section className="section-card">
            <h2>3. 태그와 검색으로 기록 탐색</h2>
            <ul className="tutorial-list">
              <li>별에 등록한 <strong>태그</strong>를 기준으로 기록을 쉽게 필터링할 수 있습니다.</li>
              <li>검색 기능을 통해 특정 제목이나 내용을 가진 기록만 빠르게 찾아볼 수 있습니다.</li>
              <li>시간 순서대로 기록을 정렬해, 과거부터 현재까지의 추억 흐름을 확인할 수 있습니다.</li>
            </ul>
          </section>

          {/* 4. 문의 */}
          <section className="section-card callout-section">
            <h2>4. 사용 중 궁금한 점이 있다면?</h2>
            <p>
              기능 사용 중 궁금한 점이나 오류가 있다면, 
              <strong> 1:1 문의 게시판(Inquiries)</strong>에 글을 남겨주세요.
              관리자가 확인 후 답변을 드립니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Tutorial;
