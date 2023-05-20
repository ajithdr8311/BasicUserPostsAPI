const express = require('express')
const app = express()
const db = require('./queries')

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/posts', db.getPosts)
app.get('/posts/:name', db.getPostByUsername)
app.post('/posts/', db.createPost)
app.put('/posts/:id', db.updatePost)
app.delete('/posts/:id', db.deletePost)

app.get('/', (req, res) => {
    res.send("User's posts")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})