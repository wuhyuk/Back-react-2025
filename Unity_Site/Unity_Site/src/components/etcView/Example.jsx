// src/components/etcView/Example.jsx
import React from 'react';
import './Example.css';

function Example() {
  return (
    <div className="example-page-wrapper scrollable">
      <main className="example-main-content">
        <div className="example-container">
          <h1 className="page-title">
            '별의 기록자' 사용 예시
          </h1>

          {/* 예시 1: 가족 행성 */}
          <section className="section-card example-section">
            <h2>예시 1. 가족( Family ) 행성</h2>
            <p className="example-desc">
              가족과의 소중한 추억만 모아 둔 전용 행성을 만들 수 있습니다.
              명절, 여행, 가족 모임 사진을 각각 별로 등록하고,
              <strong> #가족 #여행 #명절 </strong> 같은 태그를 달아두면
              나중에 특정 순간들을 쉽게 다시 찾아볼 수 있습니다.
            </p>
          </section>

          {/* 예시 2: 성장 기록 행성 */}
          <section className="section-card example-section">
            <h2>예시 2. 나의 성장 기록 행성</h2>
            <p className="example-desc">
              초등학교, 중학교, 고등학교, 군대, 대학교 등 인생의 단계별로 별을 만들고,
              그 시기의 사진과 글을 함께 남길 수 있습니다.
              <br />
              과거의 나에게 쓴 편지, 그날의 고민, 목표 등을 기록해 두면
              시간이 지나 돌아봤을 때 더욱 특별한 기록이 됩니다.
            </p>
          </section>

          {/* 예시 3: 취미 / 프로젝트 행성 */}
          <section className="section-card example-section">
            <h2>예시 3. 취미 & 프로젝트 행성</h2>
            <p className="example-desc">
              게임, 코딩, 운동, 음악 감상 등 하나의 취미를 주제로 행성을 만들고,
              진행 중인 프로젝트, 배운 내용, 느낀 점을 별로 정리할 수 있습니다.
              <br />
              예를 들어 <strong>게임 개발 기록</strong> 행성을 만들고,
              기능 구현, 디자인 시도, 오류 해결 과정을 별로 추가하면
              나만의 성장 로그이자 포트폴리오로 활용할 수 있습니다.
            </p>
          </section>

          {/* 마무리 안내 */}
          <section className="section-card callout-section">
            <h2>당신만의 예시를 만들어보세요</h2>
            <p>
              위 예시는 단지 하나의 사용 방법일 뿐입니다.  
              <br />
              {'"이건 기록할 만큼 소중한가?"'} 라는 생각이 든다면,
              그 순간은 이미 별로 남길 가치가 있는 추억입니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Example;
