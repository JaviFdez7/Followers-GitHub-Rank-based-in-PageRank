const express =  require("express")

const app = express()

let i = 0;

app.get("/",(req, res) => {
    res.send(`i value is ${i}`)
})

//ESTO ES PARA INCREMENTAR i DESDE EL NAVEGADOR
app.get("/increment/:num", (req, res) => {
    i += parseInt(req.params.num)
    res.send(`i value is ${i}`)
})

//ESTO ES PARA INCREMENTAR i DESDE POSTMAN
app.post("/increment/:num", (req, res) => {
    i += parseInt(req.params.num)
    res.status(201).send(`i value is ${i}`)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

