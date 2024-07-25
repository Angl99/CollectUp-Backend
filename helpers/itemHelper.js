const express = require('express');
const axios = require('axios');

const router = express.Router();

const EXTERNAL_API_URL = 'https://api.upcitemdb.com/prod/trial/lookup'; 

router.get('/search-external-api', async (req, res) => {
  const { code } = req.query;
  console.log(code);

  try {
    const response = await axios.get(EXTERNAL_API_URL, {
      params: { upc: code },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from external API:', error);
    res.status(500).send('Error fetching data from external API');
  }
});

module.exports = router;