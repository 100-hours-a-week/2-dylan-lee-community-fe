function toggleDropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

async function loadHeader() {
    try {
        const response = await fetch('../scripts/templates/header.html');
        if (!response.ok) {
            throw new Error(
                `Network response was not ok ${response.statusText}`
            );
        }
        const data = await response.text();
        document.querySelector('#header').innerHTML = data;

        const backButton = document.querySelector('.back-button');
        if (backButton) {
            const paths = [
                '/',
                '/login',
                '/posts',
                'edit_profile',
                'edit_password',
            ];
            if (paths.includes(window.location.pathname)) {
                backButton.style.display = 'none'; // 버튼을 보이게
            } else {
                backButton.style.display = 'block'; // 버튼을 숨기기
            }

            backButton.addEventListener('click', () => {
                if (window.location.pathname === '/post') {
                    window.location.href = '/posts';
                }
                window.history.back();
            });
        }

        const dropdownButton = document.querySelector(
            '.small-profile-container'
        );
        dropdownButton.addEventListener('click', toggleDropdown);
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);
