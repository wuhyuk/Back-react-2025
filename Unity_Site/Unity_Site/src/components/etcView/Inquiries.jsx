import React, { useState } from 'react';
import './Inquiries.css';

function Inquiries() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleWriteClick = () => {
        setIsModalOpen(true);
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (title.trim() === "" || content.trim() === "") {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        
        console.log("문의 제출:", { title, content });

        setTitle('');
        setContent('');
        setIsModalOpen(false);
        // 실제 서버 전송 로직 구현 필요
        alert("문의가 접수되었습니다.");
    };

    // 가상의 게시글 데이터 (실제는 API에서 가져와야 함)
    const mockPosts = [
        { id: 5, title: "로그인 관련 문의드립니다.", author: "관리자", date: "2025-11-17" },
        { id: 4, title: "배송 문의합니다.", author: "UserA", date: "2025-11-15" },
        { id: 3, title: "결제 오류 관련", author: "UserB", date: "2025-11-14" },
        { id: 2, title: "사이트 이용 가이드 요청", author: "UserC", date: "2025-11-13" },
        { id: 1, title: "비밀번호 재설정", author: "UserD", date: "2025-11-12" },
    ];

    const filteredPosts = mockPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="inquiries-page-wrapper scrollable">
            <main className="inquiries-main-content">
                <div className="inquiries-container">
                    <h2 className="page-title">1:1 문의 게시판</h2>
                    
                    <div className="controls-area">
                        {/* 검색창 */}
                        <input
                            type="text"
                            placeholder="제목 또는 내용 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        
                        {/* 문의 작성 버튼 */}
                        <button onClick={handleWriteClick} className="write-button primary-btn">
                            + 문의 작성
                        </button>
                    </div>

                    {/* 게시글 목록 테이블 */}
                    <div className="table-wrapper">
                        <table className="posts-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>번호</th>
                                    <th style={{ width: '55%' }}>제목</th>
                                    <th style={{ width: '15%' }}>작성자</th>
                                    <th style={{ width: '20%' }}>날짜</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <tr key={post.id}>
                                            <td>{post.id}</td>
                                            <td className="post-title-cell">{post.title}</td>
                                            <td>{post.author}</td>
                                            <td>{post.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 문의 작성 모달/폼 */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="inquiry-modal-content">
                            <h3>새 문의 작성</h3>
                            <form onSubmit={handlePostSubmit}>
                                <div className="form-group">
                                    <label htmlFor="modal-title">제목</label>
                                    <input
                                        id="modal-title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="문의 제목을 입력하세요."
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="modal-content">문의 내용</label>
                                    <textarea
                                        id="modal-content"
                                        rows="8"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        placeholder="상세한 문의 내용을 입력하세요."
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="submit-button primary-btn">제출</button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="cancel-button secondary-btn"
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Inquiries;