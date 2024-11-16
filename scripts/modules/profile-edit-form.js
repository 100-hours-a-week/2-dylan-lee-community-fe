import openModal from './modal.js';

async function checkNicknameAvailability(nickname) {
    try {
        const response = await fetch('/check-nickname', {
            method: 'POST',
            body: JSON.stringify({ nickname }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Nickname check failed');
        }

        const data = await response.json();
        return data.isTaken; // 서버가 'isTaken' 값을 반환
    } catch (error) {
        console.error('Error checking nickname availability:', error);
        return false;
    }
}

async function validateNickname() {
    const nickname = document.querySelector('#nickname').value;
    const nicknameMessage = document.querySelector('#nickname-message');
    const submitButton = document.querySelector('button[type="submit"]');

    // 메시지 초기화
    nicknameMessage.textContent = '';
    nicknameMessage.classList.remove('show');
    submitButton.disabled = false;

    if (nickname === '') {
        nicknameMessage.textContent = '닉네임을 입력해주세요.';
        nicknameMessage.classList.add('show');
        submitButton.disabled = true;
        return false;
    }

    const isNicknameTaken = await checkNicknameAvailability(nickname);
    if (isNicknameTaken) {
        nicknameMessage.textContent = '*중복된 닉네임 입니다.';
        nicknameMessage.classList.add('show');
        submitButton.disabled = true;
        return false;
    }

    if (nickname.length > 10) {
        nicknameMessage.textContent =
            '*닉네임은 최대 10자까지 작성 가능합니다.';
        nicknameMessage.classList.add('show');
        submitButton.disabled = true;
        return false;
    }

    nicknameMessage.textContent = '';
    submitButton.disabled = false;
    return true;
}

function deleteAccount() {
    console.log('탈퇴 처리');
}

function deleteAccountModal() {
    openModal(
        '회원탈퇴 하시겠습니까?',
        '작성된 게시글과 댓글은 삭제됩니다.',
        async () => {
            console.log('계정 삭제');
            try {
                deleteAccount();
                console.log('회원 탈퇴 성공');
                window.location.href = '/';
            } catch (error) {
                console.error('계정 삭제 오류:', error);
            }
        }
    );
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function modifySubmitButton() {
    const submitButton = document.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        // 유효성 검사 수행
        const isValid = await validateNickname();
        if (isValid) {
            try {
                // TODO: 서버로 데이터를 전송하는 로직 (예: 폼 데이터 전송)
                console.log('수정 완료');
                showToast('수정 완료');
                // 수정 성공 시 원하는 리다이렉트 처리
            } catch (error) {
                console.error('수정 실패:', error);
            }
        } else {
            console.log('유효성 검사 실패');
        }
    });
}

async function loadProfileEditForm() {
    try {
        const response = await fetch(
            '../scripts/templates/profile-edit-form.html'
        );
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#edit-form').innerHTML = data;

        const inputElement = document.querySelector('#nickname');
        const helperText = document.querySelector(`#nickname-message`);

        // 실시간 유효성 검사 (입력할 때마다)
        inputElement.addEventListener('input', () => {
            validateNickname();
        });

        // 포커스를 벗어날 때 유효성 검사
        inputElement.addEventListener('blur', () => {
            validateNickname();
        });

        // 포커스를 받을 때 유효성 메시지 초기화
        inputElement.addEventListener('focus', () => {
            helperText.textContent = ''; // 포커스가 가면 메시지 초기화
        });

        document
            .querySelector('#delete-account')
            .addEventListener('click', deleteAccountModal);

        modifySubmitButton();
    } catch (error) {
        console.error('Error loading profile-edit-form:', error);
    }
}

export default loadProfileEditForm;
