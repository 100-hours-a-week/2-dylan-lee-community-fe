import loadCommentBoxes from './comment-box.js';
import openModal from './modal.js';

async function submitComment(commentId = null) {
    const commentInput = document.querySelector('.comment-input');
    const commentText = commentInput.value.trim();

    if (commentText !== '') {
        const postId = window.location.pathname.split('/').pop();
        const url = commentId
            ? `/api/comments/${commentId}`
            : `/api/comments/${postId}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: commentText }),
            });

            if (!response.ok) {
                throw new Error('댓글 등록/수정 실패');
            }

            console.log(commentId ? '댓글 수정 성공' : '댓글 작성 성공');
            commentInput.value = '';
            await loadCommentBoxes(postId);

            const submitButton = document.querySelector('.button-small');
            submitButton.textContent = '댓글 작성';
            submitButton.onclick = () => submitComment();
        } catch (error) {
            console.error('댓글 등록/수정 오류:', error);
        }
    } else {
        console.error('댓글을 입력해주세요');
    }
}

function editComment(commentId) {
    // commentId의 댓글을 comment-input에 불러옴
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.button-small');
    const commentBox = document.querySelector(
        `.comment-box[data-comment-id="${commentId}"]`
    );

    const commentContent =
        commentBox.querySelector('.comment-content').textContent;
    commentInput.value = commentContent;
    submitButton.textContent = '댓글 수정';

    submitButton.onclick = () => submitComment(commentId);
}

function validateComment() {
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.button-small');

    // textarea의 입력을 감지하는 이벤트 리스너 추가
    commentInput.addEventListener('input', () => {
        // textarea에 내용이 있으면 버튼 활성화, 없으면 비활성화
        if (commentInput.value.trim().length > 0) {
            submitButton.disabled = false; // 버튼 활성화
            submitButton.style.backgroundColor = '#7F6AEE';
        } else {
            submitButton.disabled = true; // 버튼 비활성화
            submitButton.style.backgroundColor = '#ACA0EB';
        }
    });
}

async function deleteComment(commentId) {
    console.log('댓글 삭제 성공: ', commentId);
}

function deleteCommentModal(commentId) {
    openModal(
        '댓글을 삭제하시겠습니까?',
        '삭제한 내용은 복구 할 수 없습니다.',
        async () => {
            console.log('댓글 삭제');
            try {
                // fetch(`/comments/${commentId}`, {
                //     method: 'DELETE', // DELETE 메서드를 사용
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // })
                //     .then((response) => {
                //         if (response.ok) {
                //             // 삭제가 성공적으로 이루어졌을 때
                //             console.log(`댓글 ${commentId} 삭제 성공`);
                //             window.location.reload();
                //         } else {
                //             console.log(`댓글 ${commentId} 삭제 실패`);
                //             alert('댓글 삭제에 실패했습니다.');
                //         }
                //     })
                //     .catch((error) => {
                //         console.error('댓글 삭제 중 오류 발생:', error);
                //         alert('서버와의 연결에 문제가 발생했습니다.');
                //     });
                await deleteComment(commentId);
                window.location.reload();
            } catch (error) {
                console.error('게시글 삭제 오류:', error);
            }
        }
    );
}

// 댓글 컨테이너를 로드하는 함수
async function loadCommentsContainer() {
    try {
        const response = await fetch(
            '../scripts/templates/comments-container.html'
        );
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#comments-container').innerHTML = data;

        validateComment();
        document
            .querySelector('.write-comment > button')
            .addEventListener('click', submitComment);
        const postId = window.location.pathname.split('/').pop();
        loadCommentBoxes(postId);

        document
            .querySelector('.view-comment')
            .addEventListener('click', (event) => {
                if (event.target.id === 'edit-comment') {
                    const { commentId } =
                        event.target.closest('.comment-box').dataset;
                    editComment(commentId);
                }

                if (event.target.id === 'delete-comment') {
                    const { commentId } =
                        event.target.closest('.comment-box').dataset;
                    deleteCommentModal(commentId);
                }
            });
    } catch (error) {
        console.error('Error loading comments-container:', error);
    }
}

export default loadCommentsContainer;
