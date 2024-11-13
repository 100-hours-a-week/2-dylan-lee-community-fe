function validatePassword() {
    const password = document.querySelector('#password').value;
    const passwordMessage = document.querySelector('#password-message');
    const passwordCheck = document.querySelector('#password-check').value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    if (password === '') {
        passwordMessage.textContent = '*비밀번호를 입력해주세요.';
        passwordMessage.classList.add('show');
        return false;
    }

    if (!passwordRegex.test(password)) {
        passwordMessage.textContent = '*조건에 맞는 비밀번호를 입력해주세요';
        passwordMessage.classList.add('show');
        return false;
    }

    if (password !== passwordCheck) {
        passwordMessage.textContent = '*비밀번호 확인과 다릅니다.';
        passwordMessage.classList.add('show');
        return false;
    }

    passwordMessage.textContent = '';
    return true;
}

function validatePasswordCheck() {
    const password = document.querySelector('#password').value;
    const passwordCheck = document.querySelector('#password-check').value;
    const passwordCheckMessage = document.querySelector(
        '#password-check-message'
    );

    if (passwordCheck === '') {
        passwordCheckMessage.textContent = '*비밀번호를 한번 더 입력해주세요.';
        passwordCheckMessage.classList.add('show');
        return false;
    }

    if (password !== passwordCheck) {
        passwordCheckMessage.textContent = '*비밀번호와 다릅니다.';
        passwordCheckMessage.classList.add('show');
        return false;
    }

    passwordCheckMessage.textContent = '';
    return true;
}

function updateSubmitButtonState() {
    const isValid = [validatePassword(), validatePasswordCheck()].every(
        (validation) => validation
    );

    const submitButton = document.querySelector('button[type="submit"]');

    if (isValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB';
    }
}

function setupUpdatePasswordValidation() {
    const password = document.querySelector('#password');
    const passwordCheck = document.querySelector('#password-check');

    password.addEventListener('input', updateSubmitButtonState);
    passwordCheck.addEventListener('input', updateSubmitButtonState);
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
        const isValid = validatePassword() && validatePasswordCheck();
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

async function loadPasswordEditForm() {
    try {
        const response = await fetch('../scripts/templates/pw-edit-form.html');
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#edit-form').innerHTML = data;

        setupUpdatePasswordValidation();
        modifySubmitButton();
    } catch (error) {
        console.error('Error loading pw-edit-form:', error);
    }
}

export default loadPasswordEditForm;
