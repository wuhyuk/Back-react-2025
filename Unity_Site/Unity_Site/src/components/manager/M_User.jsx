// manager/M_User.jsx
import React from "react";
import "./M_User.css";

function M_User() {
  const userList = [
    { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
        { name: "홍길동", posts: 12, email: "hong@test.com", region: "서울" },
    { name: "김철수", posts: 5, email: "kim@test.com", region: "경기" },
    { name: "이영희", posts: 8, email: "lee@test.com", region: "부산" }
  ];

  return (
    <div className="m-user-container">
      
      <h2>회원 목록</h2>

      <table className="m-user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>게시물 수</th>
            <th>이메일</th>
            <th>지역</th>
          </tr>
        </thead>
        <tbody>
          
          {userList.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.posts}</td>
              <td>{user.email}</td>
              <td>{user.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default M_User;
