import loadPostbox from './postbox.js';

function postNumberRedirect() {
    const postBoxes = document.querySelectorAll('.post-box');

    postBoxes.forEach((postBox) => {
        postBox.addEventListener('click', () => {
            const postId = postBox.getAttribute('data-post-id');
            window.location.href = `/post/${postId}`;
        });
    });
}

function makePostRedirect() {
    const makePostButton = document.querySelector(
        'button[data-action="make-post"]'
    );

    makePostButton.addEventListener('click', () => {
        window.location.href = '/make_post';
    });
}

async function loadPostboxes() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error('네트워크 응답 에러');
        }

        const posts = await response.json();

        posts.forEach((post) => {
            loadPostbox(post);
        });
    } catch (error) {
        console.error('포스트 로딩 에러:', error);
    }
}

async function loadPostsContainer() {
    try {
        const response = await fetch(
            '../scripts/templates/posts-container.html'
        );
        if (!response.ok) {
            throw new Error(
                'Network response was not ok ${response.statusText)'
            );
        }
        const data = await response.text();

        document
            .querySelector('#posts-container')
            .insertAdjacentHTML('beforeend', data);

        loadPostboxes();
        makePostRedirect();
        postNumberRedirect();
    } catch (error) {
        console.error('Error loading posts-container:', error);
    }
}

export default loadPostsContainer;
