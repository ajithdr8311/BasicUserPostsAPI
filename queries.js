const Pool = require('pg').Pool
const pool = new Pool({
    user: '<USERNAME>',
    host: 'localhost',
    database: '<DB_NAME>',
    password: '<DB_PASSWORD>',
    port: '<PORT>',
})

// Get all Users
const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if(err) {
            throw err
        }
        return res.json(results.rows)
    })
}

// Get Single User
const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(
        'SELECT * FROM users WHERE user_id = $1', [id], (err, results) => {
            if(err) {
                throw err
            } else if(results.rowCount == 0) {
                res.status(400).json(`No User found with the ID ${id}`)
            } else {
                res.json(results.rows)
            }
        }
    )

}

// create New User
const createUser = (req, res) => {
    const { user_name, email } = req.body
    if(!user_name || !email) {
        return res.status(400).json({"msg": "Please Enter both name and email"})
    }

    pool.query('INSERT INTO users(user_name, email) VALUES($1, $2) RETURNING *', [user_name, email], (err, results) => {
        if(err) {
            throw err
        }
        res.send(`User with ID ${results.rows[0].user_id} added to databse`)
    })
}


// Update User
const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    let { user_name, email } = req.body

    pool.query(
        'SELECT user_name, email FROM users WHERE user_id = $1', [id], (err, results) => {
            if(err) {
                throw err
            } else {
                user_name = user_name ? user_name : results.rows[0].user_name
                email = email ? email : results.rows[0].email

                pool.query(
                    'UPDATE users SET user_name = $1, email = $2 WHERE user_id = $3 RETURNING *', [user_name, email, id], (err, results) => {
                        if(err) {
                            throw err
                        }
                        res.json(results.rows)
                    }
                )
            }
        }
    )
}

// Delete a User
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query(
        'SELECT * FROM users where user_id = $1', [id], (err, results) => {
            if(err) {
                throw err
            }
            if(results.rowCount == 0) {
                return res.status(400).json({"msg": `No User found with ID ${id}`})
            } else {
                pool.query(
                    'DELETE FROM users WHERE user_id = $1 RETURNING *', [id], (err, results) => {
                        if(err) {
                            throw err
                        }
                        res.json({"Deleted User ": results.rows})
                    }
                )
            }
        }
    )
}


// GET all Posts
const getPosts = (req, res) => {
    pool.query('SELECT * FROM posts', (err, results) => {
        if(err) {
            throw err
        }
        res.json(results.rows)
    })
}


// GET a single Post
const getPostByUsername = (req, res) => {
    const name = req.params.name
    pool.query(
        `SELECT users.user_name, posts.post_id, posts.post FROM posts JOIN users on users.user_id = posts.user_id WHERE users.user_name = $1`, [name], (err, results) => {
            if(err) {
                throw err
            }
            if(results.rowCount == 0) {
                return res.status(400).json({"msg": `No Post found with ID ${id}`})
            } else {
                return res.json(results.rows)
            }
        }
    )
}


// Create a Post
const createPost = (req, res) => {
    const { user_id, post } = req.body
    if(!user_id || !post) {
        return res.status(400).json({ "msg": "Please provide both user_id and post content" })
    }

    pool.query(
        `SELECT * from users WHERE user_id = $1`, [user_id], (err, results) => {
            if(err) {
                throw err
            }
            if(results.rowCount == 0) {
                return res.status(400).json({ "msg": `Cannot Post. No User found with ID ${user_id}` })
            }
            pool.query(
                `INSERT INTO posts(user_id, post) VALUES($1, $2)`, [user_id, post], (err, results) => {
                    if(err) {
                        throw err
                    }
                    res.json(`Post created, id: ${user_id}, content: ${post}`)
                }
            )
        }
    )
} 


// Update a Post
const updatePost = (req, res) => {
    const id = parseInt(req.params.id)
    let { user_id, post } = req.body

    if(user_id) {
        return res.status(400).json({ "msg": `Cannot update user_id` })
    }

    pool.query(
        `SELECT * FROM posts WHERE post_id = $1`, [id], (err, results) => {
            if(err) {
                throw err
            }
            
            if(results.rowCount == 0) {
                return res.status(400).json({ "msg": `No post found with ID ${id}` })
            } else {
                post = post ? post : results.rows[0].post
                pool.query(
                    'UPDATE posts SET post = $1 WHERE post_id = $2', [post, id], (err, results) => {
                        if(err) {
                            throw err
                        }
                        return res.json({"msg": `Updated post with ID: ${id}`})
                    }
                )
            }
        }
    )
}


// Delete a Post
const deletePost = (req, res) => {
    const id = parseInt(req.params.id)

    if(!id) {
        return res.status(400).json({ "msg": "Please provide Post Id" })
    }
    pool.query(
        'SELECT * FROM posts WHERE post_id = $1', [id], (err, results) => {
            if(err) {
                throw err
            }
            if(results.rowCount == 0) {
                return res.json({ "msg": `No Posts found with ID ${id}` })
            } else {
                pool.query(
                    'DELETE FROM posts WHERE post_id = $1', [id], (err, results) => {
                        if(err) {
                            throw err
                        }
                        res.json({ "msg": `Deleted post with ID ${id}` })
                    }
                )
            }
        }
    )
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getPosts,
    getPostByUsername,
    createPost,
    updatePost,
    deletePost
}