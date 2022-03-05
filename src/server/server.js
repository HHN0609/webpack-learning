const http = require('http')

const app = http.createServer((req, res) => {
    console.log(req.url)
    if(req.url === '/api/hello'){
        res.end('hello node')
    }
})

app.listen(9000, 'localhost', () => {
    console.log('localhost:9000')
})