const express = require("express")
const next = require("next")
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    server.get('/api',(req, res)=>{
        app.render(req, res)
    })
    server.post('/api/login',(req, res)=>{
        app.render(req, res)
    })
    server.put('/api',(req, res)=>{
        app.render(req, res)
    })
    server.delete('/api',(req, res)=>{
        app.render(req, res)
    })
    server.get('*',(req, res) => {
        return handle(req, res)
    })
    server.listen(3030, (err)=>{
        if(err) throw err
        console.log("server ready!")
    })
}).catch((ex) => {
    console.log(ex.stack)
    process.exit(1)
})