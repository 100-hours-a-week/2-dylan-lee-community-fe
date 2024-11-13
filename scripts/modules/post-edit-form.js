function validateForm() {
    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();
    const helperText = document.querySelector('#edit-message');

    let errorMessage = '';
    if (!title || !content) {
        errorMessage = '제목, 내용을 모두 작성해주세요.';
    }

    // helperText에 메시지 표시
    helperText.textContent = errorMessage;
    helperText.classList.add('show');
}

function updateSubmitButtonState() {
    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();

    const isValid = title !== '' && content !== '' && title.length <= 26;

    const submitButton = document.querySelector('button[type="submit"]');

    if (isValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB';
    }
}

async function handlePostEditSubmit(event) {
    event.preventDefault();

    const title = document.querySelector('#title').value.trim();
    const content = document.querySelector('#content').value.trim();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    const imageInput = document.querySelector('#post-image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    const postId = window.location.pathname.split('/').pop();
    const url = postId === 'new' ? '/post' : `/post/${postId}`; // postId가 있으면 수정, 없으면 작성

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(
                postId === 'new' ? '게시글 작성 실패' : '게시글 수정 실패'
            );
        }

        console.log(postId === 'new' ? '게시글 작성 성공' : '게시글 수정 성공');
        window.location.href = `/post/${postId}`; // 수정 후 게시글 목록으로 리디렉션
    } catch (error) {
        console.error('게시글 수정 오류:', error);
    }
}

function setupPostEditValidation() {
    const formElements = [{ id: '#title' }, { id: '#content' }];

    formElements.forEach(({ id }) => {
        const inputElement = document.querySelector(id);

        // 실시간 유효성 검사
        inputElement.addEventListener('input', () => {
            validateForm(); // 폼 유효성 검사
            updateSubmitButtonState(); // 버튼 상태 업데이트
        });

        // 포커스를 벗어날 때 유효성 검사
        inputElement.addEventListener('blur', () => {
            validateForm();
            updateSubmitButtonState();
        });

        // 포커스를 받을 때 유효성 메시지 초기화
        inputElement.addEventListener('focus', () => {
            const helperText = document.querySelector('#edit-message');
            helperText.textContent = ''; // 포커스 시 메시지 초기화
        });
    });

    // 폼 제출 시 이벤트 핸들러 설정
    const form = document.querySelector('form');
    form.addEventListener('submit', handlePostEditSubmit);
}

async function loadPostEditForm() {
    try {
        const response = await fetch(
            '../scripts/templates/post-edit-form.html'
        );
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#post-edit-form').innerHTML = data;
        setupPostEditValidation();
    } catch (error) {
        console.error('Error loading post-edit-form:', error);
    }

    const postId = window.location.pathname.split('/').pop();
    console.log('postId:', postId);

    if (postId !== 'make_post') {
        try {
            const response = await fetch(`/api/post/${postId}`);
            if (!response.ok) {
                throw new Error('네트워크 응답 에러');
            }
            const post = await response.json();

            document.querySelector('#title').value = post.title; // post 정보를 폼에 채워넣기
            document.querySelector('#content').value = post.content;

            // post 정보를 폼에 채워넣기
        } catch (error) {
            console.error('포스트 로딩 에러:', error);
        }
    } else {
        document.querySelector('#title').value = '';
        document.querySelector('#content').value = '';
        // 새 게시글 작성 페이지
    }
}

export default loadPostEditForm;
