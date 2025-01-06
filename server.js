require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.options('*', cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

app.get('/', (req, res) => {
  res.json({ msg: 'Server is running!!' });
});

app.post('/generate-token', (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  // Set token expire time in seconds
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid || 0,
    RtcRole.PUBLISHER,
    privilegeExpiredTs
  );

  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});