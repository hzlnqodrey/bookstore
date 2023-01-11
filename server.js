const express = require('express')
const PORT = 3000
const app = express()


app.get('/', (req, res) => {
    res.json("Halo, berhasil tersambung ke bookstore API")
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
})