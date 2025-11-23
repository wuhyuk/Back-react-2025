// manager/M_Decl.jsx
import React from "react";
import "./M_Decl.css";

function M_Decl() {
  const reports = [
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 1, postId: 21, user: "홍길동", reason: "욕설 포함" },
    { id: 2, postId: 13, user: "이영희", reason: "부적절한 이미지" }
  ];

  return (
    <div className="m-decl-container">
    <h2>신고된 게시물</h2>
    <div className="m-decl-scroll">
    {reports.map((r) => (
    <div className="m-decl-box" key={r.id}>
      <p>게시물 번호: {r.postId}</p>
      <p>작성자: {r.user}</p>
      <p>사유: {r.reason}</p>
      <button>삭제</button>
    </div>
  ))}
  </div>
</div>
  );
}

export default M_Decl;
