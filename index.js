const express = require('express');
const axios = require('axios');
const cors = require('cors'); // ✅ Enable CORS

const app = express();
app.use(cors()); // ✅ Allow Wix or any frontend to call the API
app.use(express.json());

const VOIP_USERNAME = process.env.VOIP_USERNAME;
const VOIP_PASSWORD = process.env.VOIP_PASSWORD;
const VOIP_DID = process.env.VOIP_DID;

app.post('/send-sms', async (req, res) => {
  const { toNumber, message } = req.body;

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

// ✅ FIX: Make sure Render uses the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
