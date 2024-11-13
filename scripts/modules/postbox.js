import { titleOverflow, formatCount, formatDate } from './utils.js';

async function loadPostbox(post) {
    const postbox = document.createElement('div');
    postbox.classList.add('post-box');

    postbox.innerHTML = `
        <div class="post-header">
            <div class="post-title">${titleOverflow(post.title)}</div>
            <div class="post-info">
                <div class="meta">
                    <div>좋아요 ${formatCount(post.likes)}</div>
                    <div>댓글 ${formatCount(post.comments_count)}</div>
                    <div>조회수 ${formatCount(post.views)}</div>
                </div>
                <div class="post-date">
                    ${formatDate(post.created_at)}
                </div>
            </div>
        </div>
        <div class="post-author">
            <div class="small-profile-container"></div>
            <div class="author-name">${post.user.username}</div>
        </div>
    `;

    postbox.addEventListener('click', () => {
        window.location.href = `/post/${post.post_id}`;
    });

    document.querySelector('.posts-wrapper').appendChild(postbox);
}

export default loadPostbox;
