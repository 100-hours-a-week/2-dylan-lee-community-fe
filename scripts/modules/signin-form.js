async function handleSigninSubmit(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const nickname = document.querySelector('#nickname').value;
    const profileImage = document.querySelector('#profile-image').files[0];

    try {
        const response = await fetch('/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password, nickname, profileImage }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('회원가입 성공', await response.json());
            window.location.href = '/login';
        } else {
            console.error('회원가입 실패', await response.text());
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
}

async function checkEmailAvailability(email) {
    try {
        const response = await fetch('/check-email', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Email check failed');
        }

        const data = await response.json();
        return data.isTaken; // 서버가 'isTaken' 값을 반환
    } catch (error) {
        console.error('Error checking email availability:', error);
        return false;
    }
}

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

function validateImage() {
    const profileImage = document.querySelector('#profile-image').files[0];
    const imageMessage = document.querySelector('#image-message');

    if (!profileImage) {
        imageMessage.textContent = '*프로필 사진을 추가해주세요.';
        imageMessage.classList.add('show');
        return false;
    }

    imageMessage.textContent = '';
    return true;
}

async function validateEmail() {
    const email = document.querySelector('#email').value;
    const emailMessage = document.querySelector('#email-message');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === '') {
        emailMessage.textContent = '*이메일을 입력해주세요.';
        emailMessage.classList.add('show');
        return false;
    }

    if (!emailRegex.test(email)) {
        emailMessage.textContent =
            '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        emailMessage.classList.add('show');
        return false;
    }

    // 중복 체크
    const isEmailTaken = await checkEmailAvailability(email);
    if (isEmailTaken) {
        emailMessage.textContent = '*중복된 이메일 입니다.';
        emailMessage.classList.add('show');
        return false;
    }

    emailMessage.textContent = '';
    return true;
}

function validatePassword() {
    const password = document.querySelector('#password').value;
    const passwordMessage = document.querySelector('#password-message');
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
        passwordCheckMessage.textContent = '*비밀번호가 다릅니다.';
        passwordCheckMessage.classList.add('show');
        return false;
    }

    passwordCheckMessage.textContent = '';
    return true;
}

// 중복 검사를 위해 비동기 함수로 서버에 요청
async function validateNickname() {
    const nickname = document.querySelector('#nickname').value;
    const nicknameMessage = document.querySelector('#nickname-message');

    // 닉네임이 비어있는지 확인
    if (nickname === '') {
        nicknameMessage.textContent = '*닉네임을 입력해주세요.';
        nicknameMessage.classList.add('show');
        return false;
    }

    // 닉네임에 공백이 있는지 확인
    const spaceRegex = /\s/;
    if (spaceRegex.test(nickname)) {
        nicknameMessage.textContent = '*띄어쓰기를 없애주세요';
        nicknameMessage.classList.add('show');
        return false;
    }

    // 닉네임 길이가 11자 이상인지 확인
    if (nickname.length > 10) {
        nicknameMessage.textContent =
            '*닉네임은 최대 10자까지 작성 가능합니다.';
        nicknameMessage.classList.add('show');
        return false;
    }

    const isNicknameTaken = await checkNicknameAvailability(nickname);
    if (isNicknameTaken) {
        nicknameMessage.textContent = '*중복된 닉네임 입니다.';
        nicknameMessage.classList.add('show');
        return false;
    }

    nicknameMessage.textContent = '';
    nicknameMessage.classList.remove('show');
    return true;
}

function updateSubmitButtonState() {
    const isValid = [
        validateImage(),
        validateEmail(),
        validatePassword(),
        validatePasswordCheck(),
        validateNickname(),
    ].every((validation) => validation);

    const submitButton = document.querySelector('button[type="submit"]');

    if (isValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB';
    }
}

function setupSigninValidation() {
    const formElements = [
        { id: '#profile-image', validate: validateImage },
        { id: '#email', validate: validateEmail },
        { id: '#password', validate: validatePassword },
        { id: '#password-check', validate: validatePasswordCheck },
        { id: '#nickname', validate: validateNickname },
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
    form.addEventListener('submit', handleSigninSubmit);
}

function profileImagePreview() {
    // 여기에 프로필 이미지 관련 로직 추가
    const profileImageElement = document.querySelector(
        '#profile-image-preview'
    );
    const fileInput = document.querySelector('#profile-image');
    const imageMessage = document.querySelector('#image-message');

    // 프로필 이미지 클릭 시 파일 선택
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                // 이미지 미리보기
                profileImageElement.src = reader.result;
                profileImageElement.style.display = 'block'; // 이미지 보이도록 설정
            };

            reader.readAsDataURL(file);
        } else {
            // 이미지가 없으면 메시지 숨김
            profileImageElement.style.display = 'none';
            imageMessage.textContent = '';
            imageMessage.classList.remove('show');
        }
    });

    // 이미지 미리보기 클릭 시 이미지 삭제
    profileImageElement.addEventListener('click', () => {
        // 이미지 삭제
        profileImageElement.style.display = 'none';
        fileInput.value = ''; // 파일 입력 초기화

        // 삭제 후 메시지 초기화
        imageMessage.textContent = '프로필 사진을 추가해주세요.';
        imageMessage.classList.remove('show');
    });
}

function loginPageRedirect() {
    const redirectButton = document.querySelector('[data-action="login-form"]');
    redirectButton.addEventListener('click', () => {
        window.location.href = '/login';
    });
}

async function loadSigninForm() {
    try {
        const response = await fetch('../scripts/templates/signin-form.html');
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#signin-form').innerHTML = data;

        profileImagePreview();
        loginPageRedirect();
        setupSigninValidation();
    } catch (error) {
        console.error('Error loading signin-form:', error);
    }
}

export default loadSigninForm;
