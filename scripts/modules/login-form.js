async function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('로그인 성공', await response.json());
            window.location.href = '/posts';
        } else {
            console.error('로그인 실패', await response.text());
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

function validateEmail() {
    const email = document.querySelector('#email').value;
    const emailMessage = document.querySelector('#email-message');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === '' || !emailRegex.test(email)) {
        emailMessage.textContent = '올바른 이메일 주소 형식을 입력해주세요.';
        emailMessage.classList.add('show');
        return false;
    }

    emailMessage.textContent = '';
    return true;
}

function validatePassword() {
    const password = document.querySelector('#password').value;
    const passwordMessage = document.querySelector('#password-message');

    // 로그인 단계이므로 비밀번호가 8자 이상인지만 확인
    const passwordRegex = /.{8,}/;

    if (password === '' || !passwordRegex.test(password)) {
        passwordMessage.textContent = '비밀번호를 입력해주세요.';
        passwordMessage.classList.add('show');
        return false;
    }

    passwordMessage.textContent = '';
    return true;
}

function updateSubmitButtonState() {
    const isValid = [validateEmail(), validatePassword()].every(
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

function signinPageRedirect() {
    const redirectButton = document.querySelector(
        '[data-action="signin-form"]'
    );
    redirectButton.addEventListener('click', () => {
        window.location.href = '/signin';
    });
}

function setupLoginValidation() {
    const formElements = [
        { id: '#email', validate: validateEmail },
        { id: '#password', validate: validatePassword },
    ];

    // 각 input 필드에 대해 이벤트 리스너를 한 번에 설정
    formElements.forEach(({ id, validate }) => {
        const inputElement = document.querySelector(id);
        const helperText = document.querySelector(
            `#${inputElement.id}-message`
        );

        // 실시간 유효성 검사 (입력할 때마다)
        inputElement.addEventListener('input', () => {
            validate();
            updateSubmitButtonState();
        });

        // 포커스를 벗어날 때 유효성 검사
        inputElement.addEventListener('blur', () => {
            validate();
            updateSubmitButtonState();
        });

        // 포커스를 받을 때 유효성 메시지 초기화
        inputElement.addEventListener('focus', () => {
            helperText.textContent = ''; // 포커스가 가면 메시지 초기화
        });
    });

    // 폼 제출 시 이벤트 핸들러 설정
    const form = document.querySelector('form');
    form.addEventListener('submit', handleLoginSubmit);
}

async function loadLoginForm() {
    try {
        const response = await fetch('../scripts/templates/login-form.html');
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#login-form').innerHTML = data;

        signinPageRedirect();
        setupLoginValidation();
    } catch (error) {
        console.error('Error loading login-form:', error);
    }
}

export default loadLoginForm;
