import express from 'express';
import cors from 'cors';

import checkUrlRouter from './routes/checkUrl.js';
import checkEmailRouter from './routes/checkEmail.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/check-url', checkUrlRouter);
app.use('/check-email', checkEmailRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
