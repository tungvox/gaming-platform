import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

let data;
try {
  const rawData = readFileSync(path.join(__dirname, '../data.json'), 'utf-8');
  console.log('Raw data loaded successfully');
  data = JSON.parse(rawData);
  console.log('Data parsed successfully');
  console.log(`Loaded ${data.games.length} games, ${data.providers.length} providers, and ${data.groups.length} groups`);
} catch (error) {
  console.error('Error loading or parsing data:', error);
  data = { games: [], providers: [], groups: [] };
}

const users = [
  { id: 1, username: 'player1', password: bcrypt.hashSync('player1', 10) },
  { id: 2, username: 'player2', password: bcrypt.hashSync('player2', 10) },
];

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.get('/games', authenticateToken, (req: express.Request, res: express.Response) => {
  console.log('Accessing /games route');
  if (!data || !data.games) {
    console.error('Data is not in the expected format');
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
  console.log(`Sending ${data.games.length} games, ${data.providers.length} providers, and ${data.groups.length} groups`);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
