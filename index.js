const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const VOIP_USERNAME = process.env.VOIP_USERNAME;
const VOIP_PASSWORD = process.env.VOIP_PASSWORD;
const VOIP_DID = process.env.VOIP_DID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;  // ✅ Store secret token in env vars

app.post('/send-sms', async (req, res) => {
  const { toNumber, message, token } = req.body;

  if (token !== ACCESS_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!toNumber || !message) {
    return res.status(400).json({ error: "Missing toNumber or message" });
  }

  try {
    const params = new URLSearchParams({
      api_username: VOIP_USERNAME,
      api_password: VOIP_PASSWORD,
      method: "sendSMS",
      did: VOIP_DID,
      dst: toNumber,
      message,
    });

    const voipRes = await axios.get(`https://www.voip.ms/api/v1/rest.php?${params.toString()}`);
    res.json(voipRes.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
