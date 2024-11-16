import { formatDate, formatContentAsParagraphs } from './utils.js';
import openModal from './modal.js';

function deletePostModal() {
    openModal(
        '게시글을 삭제하시겠습니까?',
        '삭제한 내용은 복구 할 수 없습니다.',
        async () => {
            console.log('게시글 삭제');
            try {
                // const response = await fetch('/delete-post', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         postId: window.location.pathname.split('/').pop(),
                //     }),
                //     headers: { 'Content-Type': 'application/json' },
                // });
                // if (!response.ok) {
                //     throw new Error('게시글 삭제 실패');
                // }
                console.log('게시글 삭제 성공');
                window.location.href = '/posts';
            } catch (error) {
                console.error('게시글 삭제 오류:', error);
            }
        }
    );
}

async function loadPostContainer(postId) {
    try {
        const response = await fetch(`/api/post/${postId}`);
        if (!response.ok) {
            throw new Error('네트워크 응답 에러');
        }

        const post = await response.json();
        console.log(post);
        const postContent = `
            <div class="post-header">
                <div class="h2-title">${post.title}</div>
                <div class="post-info">
                    <div class="meta">
                        <div class="small-profile-container"></div>
                        <div class="author-name">${post.user.username}</div>
                        <div class="post-date">${formatDate(post.created_at)}</div>
                    </div>
                    <div class="edit-buttons">
                        <button id="edit-post">수정</button>
                        <button id="delete-post">삭제</button>
                    </div>
                </div>
            </div>
            <div class="line"></div>
            <div class="post-content">
                <img src="example.jpg" alt="Post Image" class="post-content-image" />
                ${formatContentAsParagraphs(post.content)}
            </div>
            <div class="reaction-buttons">
                <div class="reaction-button" id="likes">${post.likes}<br />좋아요수</div>
                <div class="reaction-button" id="views">${post.views}<br />조회수</div>
                <div class="reaction-button" id="comments-count">
                    ${post.comments_count}<br />댓글
                </div>
            </div>
            <div class="line"></div>
        `;

        document.querySelector('#post-container').innerHTML = postContent;
        document
            .querySelector('#delete-post')
            .addEventListener('click', deletePostModal);

        document.querySelector('#edit-post').addEventListener('click', () => {
            window.location.href = `/edit_post/${postId}`;
        });
    } catch (error) {
        console.error('Error loading post-container:', error);
    }
}

export default loadPostContainer;
