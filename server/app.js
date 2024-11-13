import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// json 파일을 읽어오는 함수
const loadJson = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('JSON 파일 읽기 오류:', error);
        throw error;
    }
};

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// Static files serving
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/styles', express.static(path.join(__dirname, '../styles')));
app.use('/scripts', express.static(path.join(__dirname, '../scripts')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/login.html'));
});

// 회원 가입 페이지
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/signin.html'));
});

// 로그인 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/login.html'));
});

// 포스트 리스트 페이지
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/posts.html'));
});

// 게시물 페이지
app.get('/post/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/post.html'));
});

// 게시물 작성 페이지
app.get('/make_post', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/make_post.html'));
});

// 게시물 수정 페이지
app.get('/edit_post/:postId', (req, res) => {
    console.log(req.params);
    res.sendFile(path.join(__dirname, '../pages/edit_post.html'));
});

// 비밀번호 수정 페이지
app.get('/edit_password', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/edit_password.html'));
});

// 프로필 수정 페이지
app.get('/edit_profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/edit_profile.html'));
});

// POST /login 요청을 처리하는 라우트
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const usersFilePath = process.env.USERS_DATA_PATH;

    try {
        const users = await loadJson(usersFilePath);

        const user = users.find((userItem) => userItem.email === email);

        if (user) {
            if (user.password === password) {
                return res.status(200).json({ message: '로그인 성공' });
            }
            return res.status(401).json({ message: '잘못된 자격 증명' });
        }
        return res.status(401).json({ message: '사용자를 찾을 수 없음' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류' });
    }
});

// 이메일 중복 체크
app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    const usersFilePath = process.env.USERS_DATA_PATH;

    try {
        const users = await loadJson(usersFilePath);

        const user = users.find((userItem) => userItem.email === email);

        if (user) {
            return res.json({ isTaken: true });
        }
        return res.json({ isTaken: false });
    } catch (error) {
        console.error('Error loading users data:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

// 닉네임 중복 체크
app.post('/check-nickname', async (req, res) => {
    const { nickname } = req.body;

    const usersFilePath = process.env.USERS_DATA_PATH;

    try {
        const users = await loadJson(usersFilePath);

        const user = users.find((userItem) => userItem.username === nickname);

        if (user) {
            return res.json({ isTaken: true });
        }
        return res.json({ isTaken: false });
    } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
        return res.status(500).json({ message: '사용자 데이터 로드 오류' });
    }
});

// post의 목록과 그 작성자를 반환하는 api
app.get('/api/posts', async (_, res) => {
    const postsFilePath = process.env.POSTS_DATA_PATH;
    const usersFilePath = process.env.USERS_DATA_PATH;

    try {
        const posts = await loadJson(postsFilePath);
        const users = await loadJson(usersFilePath);

        // posts 데이터에 user_id에 해당하는 user 데이터를 찾아서 추가
        const postsWithUserInfo = posts.map((post) => {
            const user = users.find(
                (userItem) => userItem.user_id === post.user_id
            );
            return {
                ...post, // 기존 post 데이터
                user: user
                    ? { username: user.username, profile_pic: user.profile_pic }
                    : null,
            };
        });

        return res.json(postsWithUserInfo);
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

app.get('/api/post/:postId?', async (req, res) => {
    const { postId } = req.params;

    const postsFilePath = process.env.POSTS_DATA_PATH;
    const usersFilePath = process.env.USERS_DATA_PATH;

    try {
        if (postId !== 'make_post') {
            const posts = await loadJson(postsFilePath);
            const users = await loadJson(usersFilePath);
            const post = posts.find(
                (postItem) => postItem.post_id === Number(postId)
            );
            if (post) {
                const user = users.find(
                    (userItem) => userItem.user_id === post.user_id
                );

                return res.json({
                    ...post,
                    user: user ? { username: user.username } : null,
                });
            }
        }
        return res.status(200).json({ message: '새 게시물 생성' });
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

app.get('/api/comments/:postId', async (req, res) => {
    const { postId } = req.params;

    const usersFilePath = process.env.USERS_DATA_PATH;
    const commentsFilePath = process.env.COMMENTS_DATA_PATH;
    try {
        const users = await loadJson(usersFilePath);
        const comments = await loadJson(commentsFilePath);
        const postComments = comments.filter(
            (commentItem) => commentItem.post_id === Number(postId)
        );

        // 각 댓글에 작성자 정보를 추가
        const commentsWithUserInfo = postComments.map((comment) => {
            const user = users.find(
                (userItem) => userItem.user_id === comment.user_id
            );
            return {
                ...comment,
                user: user
                    ? { username: user.username, profile_pic: user.profile_pic }
                    : null,
            };
        });

        return res.json(commentsWithUserInfo);
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

app.get('/api/comment/:commenId', async (req, res) => {
    const { commentId } = req.params;

    const commentsFilePath = process.env.COMMENTS_DATA_PATH;
    try {
        const comments = await loadJson(commentsFilePath);
        const comment = comments.find(
            (commentItem) => commentItem.comment_id === Number(commentId)
        );

        if (comment) {
            return res.json(comment);
        }
        return res.status(404).json({ message: '댓글을 찾을 수 없음' });
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

app.post('/api/comments/:postId', (req, res) => {
    const postId = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: '댓글 내용을 입력해주세요' });
    }

    return res.status(201).json({
        postId,
        content,
    });
});

// 댓글 수정 (POST /api/comments/:commentId)
app.post('/api/comments/:commentId', (req, res) => {
    const commentId = req.params;
    const { content } = req.body;

    const commentsFilePath = process.env.COMMENTS_DATA_PATH;
    try {
        const comments = loadJson(commentsFilePath);
        const comment = comments.find(
            (commentItem) => commentItem.comment_id === Number(commentId)
        );

        if (comment) {
            return res.json(comment, content);
        }
        return res.status(404).json({ message: '댓글을 찾을 수 없음' });
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return res.status(500).json({ message: '서버 오류' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
