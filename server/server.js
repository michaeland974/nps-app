const express = require('express');
const app = express();

app.get("/api", (req, res, next) => {
    res.json({"users": ["user1", "user2", "user3", "user4"]})
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})