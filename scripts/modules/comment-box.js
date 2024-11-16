import { formatDate } from './utils.js';

// 코멘트 박스 로드 함수
async function loadCommentBox(comment) {
    const commentbox = document.createElement('div');
    commentbox.classList.add('comment-box');
    commentbox.dataset.commentId = comment.comment_id;

    commentbox.innerHTML = `
        <div class="post-info">
            <div class="meta">
                <div class="small-profile-container"></div>
                <div class="author-name">${comment.user.username}</div>
                <div class="post-date">${formatDate(comment.created_at)}</div>
            </div>
            <div class="edit-buttons">
                <button id="edit-comment">수정</button>
                <button id="delete-comment">삭제</button>
            </div>
        </div>
        <p class="comment-content">${comment.content}</p>
    `;

    // 코멘트 박스의 html 요소를 .view-comment에 삽입
    document.querySelector('.view-comment').appendChild(commentbox);
}

// post의 id를 받아 코멘트 박스 로드 함수
async function loadCommentBoxes(postId) {
    const response = await fetch(`/api/comments/${postId}`);
    if (!response.ok) {
        throw new Error('네트워크 응답 에러');
    }

    // post id에 해당하는 코멘트를 받아와 각각 코멘트 박스 로드
    const comments = await response.json();
    comments.forEach((comment) => {
        loadCommentBox(comment);
    });
}

export default loadCommentBoxes;
