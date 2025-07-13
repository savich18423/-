const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const upload = multer();
app.use(cors());
app.use(express.static(__dirname));

const BOT_TOKEN = 'твой_токен_бота';
const CHAT_ID = '-1002368041126'; // сюда слать

app.post('/send', upload.single('file'), async (req, res) => {
  const name = req.body.name || 'Аноним';
  const message = req.body.message || '';
  const file = req.file;

  const caption = `<b>👤 От:</b> ${name}\n\n📝 ${message}`;

  try {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('parse_mode', 'HTML');

    if (file) {
      formData.append('document', new Blob([file.buffer]), file.originalname);
      formData.append('caption', caption);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData
      });
    } else {
      formData.append('text', caption);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        body: formData
      });
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`));
