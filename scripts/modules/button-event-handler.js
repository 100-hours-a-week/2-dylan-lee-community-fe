/* eslint-disable indent */
export default function attachButtonEventListeners() {
    // 모든 버튼에 대한 이벤트 리스너 추가
    const buttons = document.querySelectorAll('[data-action]');
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const { action } = event.target.dataset; // data-action 속성 값 가져오기
            switch (action) {
                case 'login':
                    console.log('로그인 버튼 클릭');
                    // 로그인 처리 로직
                    break;
                case 'signin':
                    // 회원가입 처리 로직
                    break;
                case 'signin-form':
                    window.location.href = '/signin';
                    break;
                case 'login-form':
                    window.location.href = '/login';
                    break;
                // 다른 버튼에 대한 처리를 추가
                default:
                    console.log(`${action} 버튼 클릭`);
            }
        });
    });
}
