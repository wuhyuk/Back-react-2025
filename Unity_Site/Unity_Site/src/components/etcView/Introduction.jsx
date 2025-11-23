import React from 'react';
import './Introduction.css';

function Introduction() {
    return (
        <div className="introduction-page-wrapper scrollable">
            <main className="introduction-main-content">
                <div className="introduction-container">
                    <h1 className="page-title">
                        나만의 우주를 만드는 곳,<br/>
                        '별의 기록자'에 오신 것을 환영합니다
                    </h1>

                    <section className="section-card hero-section">
                        <div className="hero-text">
                            <h2>🌌 기억을 우주에 새기다</h2>
                            <p>
                                평범한 일상의 추억을 잊히지 않는 별처럼 만들어 보세요. 
                                '별의 기록자'는 사용자의 소중한 순간들을 우주 공간에 영원히 보존해 주는 **개인화된 메모리 아카이브 웹사이트**입니다.
                            </p>
                        </div>
                        {/* 이미지나 애니메이션 Placeholder */}
                        <div className="hero-visual">[우주/행성 콘셉트 이미지 자리]</div>
                    </section>
                    
                    <section className="section-card feature-section">
                        <h2>✨ 주요 기능</h2>
                        <div className="feature-grid">
                            <div className="feature-item">
                                <h3>나만의 행성 창조</h3>
                                <p>가장 소중한 사람과의 추억, 중요한 사건 등 의미 있는 주제로 독창적인 행성(Planet)을 디자인하고 생성합니다.</p>
                            </div>
                            <div className="feature-item">
                                <h3>기록의 별자리</h3>
                                <p>사진, 동영상, 텍스트 일기를 행성 주위를 맴도는 별(Star)로 저장하세요. 시간의 흐름에 따라 나만의 별자리가 완성됩니다.</p>
                            </div>
                            <div className="feature-item">
                                <h3>태그로 연결된 은하</h3>
                                <p>각 별에 태그를 지정하여 기록을 분류하고, 동일한 태그를 가진 별들을 모아 하나의 은하(Galaxy)처럼 탐색할 수 있습니다.</p>
                            </div>
                        </div>
                    </section>

                    <section className="section-card callout-section">
                        <h2>🌠 지금 바로 시작하세요!</h2>
                        <p>
                            당신의 추억은 소중합니다. '별의 기록자'에서 잊고 싶지 않은 순간들을 아름다운 디지털 우주로 만들어 보세요.
                            나만의 우주를 탐험할 준비가 되셨다면, 지금 바로 가입하고 첫 번째 행성을 만들어보세요!
                        </p>
                        <button className="cta-button primary-btn" onClick={() => console.log('가입 페이지로 이동')}>
                            나만의 우주 만들기 시작
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Introduction;