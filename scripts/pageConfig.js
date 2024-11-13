import loadLoginForm from './modules/login-form.js';
import loadSigninForm from './modules/signin-form.js';
import loadPostEditForm from './modules/post-edit-form.js';
import loadPostsContainer from './modules/posts-container.js';
import loadProfileEditForm from './modules/profile-edit-form.js';
import loadPasswordEditForm from './modules/pw-edit-form.js';

const pageConfig = {
    '/': loadLoginForm,
    '/login': loadLoginForm,
    '/signin': loadSigninForm,
    '/posts': loadPostsContainer,
    '/make_post': loadPostEditForm,
    '/edit_profile': loadProfileEditForm,
    '/edit_password': loadPasswordEditForm,
};

export default pageConfig;
