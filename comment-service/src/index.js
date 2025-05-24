const express = require('express');
const app = express();
const port = process.env.PORT || 3003;

app.get('/', (req, res) => {
  res.send('Comment Service is running!');
});

app.listen(port, () => {
  console.log(`Comment Service listening on port ${port}`);
}); 