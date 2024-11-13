import pageConfig from './pageConfig.js';
import loadPostContainer from './modules/post-container.js';
import loadCommentsContainer from './modules/comments-container.js';
import loadPostEditForm from './modules/post-edit-form.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.startsWith('/post/')) {
        const postId = path.split('/').pop();
        loadPostContainer(postId); // 동적으로 postId에 맞는 콘텐츠 로드
        loadCommentsContainer(postId); // 동적으로 postId에 맞는 댓글 로드
    } else if (path.startsWith('/edit_post/')) {
        const postId = path.split('/').pop();
        loadPostEditForm(); // 동적으로 postId에 맞는 콘텐츠 로드
    } else if (pageConfig[path]) {
        pageConfig[path](); // 해당 페이지 로딩 함수 실행
    } else {
        console.error(`페이지 로드 실패: ${path}`);
        // 404 페이지로 리디렉션 등 추가 처리
    }
});
