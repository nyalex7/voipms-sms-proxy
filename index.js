const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const VOIP_USERNAME = process.env.VOIP_USERNAME;
const VOIP_PASSWORD = process.env.VOIP_PASSWORD;
const VOIP_DID = process.env.VOIP_DID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;  // ✅ Secure token

// ✅ 1. Send SMS
app.post('/send-sms', async (req, res) => {
  const { toNumber, message, token } = req.body;

  if (token !== ACCESS_TOKEN) return res.status(403).json({ error: "Unauthorized" });
  if (!toNumber || !message) return res.status(400).json({ error: "Missing toNumber or message" });

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
    console.error("SMS error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 2. Get current DID routing
app.get('/get-did-routing', async (req, res) => {
  const { did, token } = req.query;

  if (token !== ACCESS_TOKEN) return res.status(403).json({ error: "Unauthorized" });
  if (!did) return res.status(400).json({ error: "Missing DID parameter" });

  try {
    const params = new URLSearchParams({
      api_username: VOIP_USERNAME,
      api_password: VOIP_PASSWORD,
      method: "getDIDsInfo",
      did
    });

    const voipRes = await axios.get(`https://www.voip.ms/api/v1/rest.php?${params.toString()}`);
    res.json(voipRes.data);
  } catch (error) {
    console.error("Get routing error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 3. Set DID routing
app.post('/set-did-routing', async (req, res) => {
  const { did, routing, token } = req.body;

  if (token !== ACCESS_TOKEN) return res.status(403).json({ error: "Unauthorized" });
  if (!did || !routing) return res.status(400).json({ error: "Missing DID or routing" });

  try {
    const params = new URLSearchParams({
      api_username: VOIP_USERNAME,
      api_password: VOIP_PASSWORD,
      method: "setDIDRouting",
      did,
      routing
    });

    const voipRes = await axios.get(`https://www.voip.ms/api/v1/rest.php?${params.toString()}`);
    res.json(voipRes.data);
  } catch (error) {
    console.error("Set routing error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
