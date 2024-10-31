import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/html', express.static(path.join(__dirname, 'public/html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/login.html'));
});

app.get('/edit_password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/edit_password.html'));
});

app.get('/edit_post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/edit_post.html'));
});

app.get('/edit_profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/edit_profile.html'));
});

app.get('/make_post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/make_post.html'));
});

app.get('/post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/post.html'));
});

app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/posts.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/signin.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
