import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express()

import mysql from 'mysql';
import cors from 'cors';

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
const port = process.env.PORT

const CREDENTIALS = {
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
}

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}


const db = mysql.createPool(CREDENTIALS);

app.use(cors(corsOptions));

app.use(express.json());

// ---------------------- Login ----------------------

app.use('/login', (req, res) => {
    const sql = `SELECT password FROM user WHERE username=?`;
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    console.log("username: ", username, password);

    try {
        db.query(sql, [username], (err, rows, fields) => {
            try {
                console.log(rows[0].password);
                if (rows[0].password === password) {
                    res.send({ status: 'success' });
                }
                else res.send({ status: 'failed' });
            }
            catch (err) {
                console.error(err);
            }
        })
    }
    catch (err) {
        console.error(err);
    }
})

// ---------------------- (insert query) news ----------------------

app.post('/insert/news', (req, res) => {
    const NEWS_INSERT = `insert into news_tb (title, type, news) values(?, ?, ?) `;

    const title = req.body.title.trim();
    const type = req.body.type.trim();
    const news = req.body.news.trim();

    console.log(title, type, news);

    try {
        db.query(NEWS_INSERT, [title, type, news], (err, rows, fields) => {
            try {
                // console.log(rows);
                if (err) res.send({ status: 'error' });
                else res.send({ status: 'success' });
            }
            catch (err) {
                console.error(err);
            }
        })
    }
    catch (err) {
        console.error(err);
    }
})

// ---------------------- (select query) news ----------------------


app.post('/select/news', (req, res) => {
    const NEWS_SELECT = `select * from  news_tb  ;`;

    try {
        db.query(NEWS_SELECT, (err, rows, fields) => {
            try {
                // console.log(rows);
                if (err) res.send({ row: ['error'] });
                else res.send({ row: rows });
            }
            catch (err) {
                console.error(err);
            }
        })
    }
    catch (err) {
        console.error(err);
    }
})

// ---------------------- (select specific query) news ----------------------

app.post('/select/row', (req, res) => {
    const SELECT_NEWS_ROW = `select * from news_tb where id = ? ;`;
    const id = req.body.id;

    console.log(id);

    db.query(SELECT_NEWS_ROW, [id], (err, rows, fields) => {
        if (err) res.send({ selectRow: 'error' });
        else {
            res.send({ selectRow: rows })
        }
    })

})


// ---------------------- (update query) news ----------------------

app.post('/edit/news', (req, res) => {
    const NEWS_UPDATE = `update news_tb set title=?, type=?, news=? where id=? ;`;

    const title = req.body.title;
    const type = req.body.type;
    const news = req.body.news;

    const id = req.body.id;

    try {
        db.query(NEWS_UPDATE, [title, type, news, id], (err, rows, fields) => {
            try {
                // console.log(rows);
                if (err) res.send({ status: 'error' });
                else res.send({ status: 'success' });
            }
            catch (err) {
                console.error(err);
            }
        })
    }
    catch (err) {
        console.error(err);
    }
})

app.post('/delete/news', (req, res) => {
    console.log('delete news');

    const DELETE_NEWS = `delete from news_tb where id = ? ;`;

    const id = req.body.id;
    console.log(id);

    try {
        db.query(DELETE_NEWS, [id], (err, rows, fields) => {
            if (err) {
                res.send({ status: 'error' });
                console.log(err);

            }
            else res.send({ status: 'success' });
        })
    }
    catch (err) {
        console.log(err);
    } 
});

app.listen(port, () => console.log('server started at port ' + port))