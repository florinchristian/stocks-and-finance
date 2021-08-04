const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');
const md5 = require('md5');
const multer = require('multer');
const uploader = multer({ dest: __dirname + '/StocksFinanceStorage' });
const fs = require('fs');

const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

const HOST = '192.168.20.64:40389';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sendNotifications = async (tokens, title, body, imgurl) => {
    await admin.messaging().sendMulticast({
        tokens,
        notification: {
            title: title,
            body: body,
            imageUrl: (imgurl == null) ? 'https://i.ytimg.com/vi/if-2M3K1tqk/maxresdefault.jpg' : imgurl
        }
    });

    console.log('Notifications sent!');
};


var dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'acvamarin',
    database: 'homedb'
});

dbcon.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Successfully connected to the database!');
    }
});

app.get('/', (req, res) => {
    res.send('Stocks&Fiance Server is running!');
});

app.get('/usernameAvailable', (req, res) => {
    var username = req.query.username;

    dbcon.query(`select id from users where username="${username}"`, 
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            res.send({available: (results.length == 0)});
        });
});

app.get('/emailAvailable', (req, res) => {
    var email = req.query.email;

    dbcon.query(`select id from users where email="${email}"`, 
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            res.send({available: (results.length == 0)});
        });
});

app.get('/unansweredCount', (req, res) => {
    dbcon.query('select count(id) as UnansweredCount from questions where response=""',
        (err, results, fields) => {
            if (err) {
                console.log(err);
            }

            res.send(results);
        });
});

app.get('/changePassword', (req, res) => {
    var user = req.query.user;
    var newPassword = req.query.newPass;

    dbcon.query(`update users set password='${newPassword}' where username='${user}'`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            res.send({ ok: true });
        });
});

app.get('/changeEmail', (req, res) => {
    var oldEmail = req.query.old;
    var newEmail = req.query.new;

    dbcon.query(`update users set email='${newEmail}' where email='${oldEmail}'`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            res.send({ ok: true });
        });
});

app.get('/changeUsername', (req, res) => {
    var oldUsername = req.query.old;
    var newUsername = req.query.new;

    dbcon.query(`update users set username='${newUsername}' where username='${oldUsername}'`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            dbcon.query(`update questions set username='${newUsername}' where username='${oldUsername}'`,
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    dbcon.query(`update likes set username='${newUsername}' where username='${oldUsername}'`,
                        (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            dbcon.query(`update comments set username='${newUsername}' where username='${oldUsername}'`,
                                (err, results, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }

                                    res.send({ ok: true });
                                });
                        });
                });
        });
});


app.get('/readSlideshowImage', (req, res) => {
    var id = req.query.id;
    var index = req.query.index;
    var name = req.query.name;

    res.sendFile(__dirname + `/posts/${id}/${index}/${name}`);
});

app.get('/getSlideshowImages', (req, res) => {
    var id = req.query.id;
    var index = req.query.index;

    fs.readdir(__dirname + `/posts/${id}/${index}`, (err, files) => {
        if (err) {
            res.send([]);
        } else {
            var result = [];

            for (var i in files) {
                result.push(
                    `http://${HOST}/readSlideshowImage?id=${id}&index=${index}&name=${files[i]}`
                );
            }

            res.send(result);
        }
    });
});

app.get('/getArticleThumbnail', (req, res) => {
    var id = req.query.id;

    if (fs.existsSync(__dirname + `/posts/${id}/thumbnail.png`)) {
        res.sendFile(__dirname + `/posts/${id}/thumbnail.png`);
    } else res.send(null);
});

app.get('/getArticle', (req, res) => {
    var id = req.query.id;

    dbcon.query(`select articleField from posts where imgfolder like '%${id}%'`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }
            try {
                res.send(results[0]['articleField']);
            } catch (err) {
                console.log(err);
                console.log(`select articleField from posts where articleField like '%${id}%'`);
            }
        });
});

app.get('/sendAnswer', (req, res) => {
    var id = parseInt(req.query.id);
    var body = req.query.body;

    dbcon.query(`update questions set response="${body}" where id=${id}`,
        (err, result, fields) => {
            if (err) {
                res.send({ 'ok': false });
            } else {
                res.send({ 'ok': true });

                dbcon.query(`select username from questions where id=${id}`, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }

                    dbcon.query(`select notifToken from users where username='${results[0]['username']}'`,
                        (err, results, fields) => {
                            if (err) {
                                console.log(err);
                            }

                            sendNotifications([results[0]['notifToken']], 'Check your inbox', 'An admin answered your question!');
                        });
                });
            }
        });
});

app.get('/getAdminQuestions', (req, res) => {
    dbcon.query(`select id, username, body from questions where response like ''`,
        (err, result, fields) => {
            res.send({ 'questions': result });
        });
});

app.get('/getUserQuestions', (req, res) => {
    var username = req.query.username;

    var data = {};

    dbcon.query(`select id, username, body, response from questions where username='${username}' and response not like ''`,
        (err, result, fields) => {
            if (result.length == 0) {
                data['answered'] = [];
            } else {
                data['answered'] = result;
            }

            dbcon.query(`select id, username, body from questions where username='${username}' and response like ''`,
                (err, result, fields) => {
                    if (result.length == 0) {
                        data['pending'] = [];
                    } else {
                        data['pending'] = result;
                    }

                    res.send(data);
                });
        });
});

app.get('/sendQuestion', (req, res) => {
    var username = req.query.username;
    var body = req.query.body;

    dbcon.query(`insert into questions(username, body, response) values("${username}", "${body}", "")`,
        (err, result, fields) => {
            if (err) {
                res.send({ 'ok': false });
            } else {
                res.send({ 'ok': true });

                dbcon.query('select notifToken from users where username like "%admin%"', (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }

                    var tokens = [];

                    for (var i in results) {
                        tokens.push(results[i]['notifToken']);
                    }

                    sendNotifications(tokens, 'Check your inbox', `${username} needs your help!`, null);
                });
            }
        });
});

app.get('/getComments', (req, res) => {
    var postId = req.query.postId;
    var index = req.query.index;

    if (index == -1) {
        dbcon.query(`select id, username, body from comments where postId='${postId}' order by id desc limit 5`,
            (err, result, fields) => {
                if (err) {
                    res.send({ ok: false });
                } else {
                    res.send({ ok: true, comments: result });
                }
            });
    } else {
        dbcon.query(`select id, username, body from comments where postId='${postId}' and id < ${index} order by id desc limit 5`,
            (err, result, fields) => {
                if (err) {
                    res.send({ ok: false });
                } else {
                    res.send({ ok: true, comments: result });
                }
            });
    }
});

app.get('/sendComment', (req, res) => {
    var postId = req.query.postId;
    var username = req.query.username;
    var msg = req.query.msg;

    dbcon.query(`insert into comments(username, body, postId, parent) values ('${username}','${msg}','${postId}', -1)`
        , (err, result, fields) => {
            if (err) {
                res.send({ ok: false });
            } else {
                res.send({ ok: true });

                dbcon.query('select notifToken from users where username like "%admin%"', (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }

                    var tokens = [];

                    for (var i in results) {
                        tokens.push(results[i]['notifToken']);
                    }

                    dbcon.query(`select title from posts where imgfolder=${postId}`, (err, results, field) => {
                        if (err) {
                            console.log(err);
                        }

                        var pTitle = (JSON.parse(results[0]['title']))['en'];

                        sendNotifications(tokens, pTitle, `${username} commented on your post`, null);
                    });
                });
            }
        });
});

app.get('/likePost', (req, res) => {
    var user = req.query.user;
    var postId = req.query.postId;

    dbcon.query(`select id from likes where username='${user}' and postId='${postId}'`
        , (err, result, fields) => {
            if (result.length != 0) {
                dbcon.query(`delete from likes where username='${user}' and postId='${postId}'`
                    , (err, result, fields) => {
                        res.send({ liked: false });
                    });
            } else {
                dbcon.query(`insert into likes(username, postId) values('${user}','${postId}')`
                    , (err, result, fields) => {
                        res.send({ liked: true });
                    });
            }
        });
});

app.get('/getLikes', (req, res) => {
    var postId = req.query.id;
    var username = req.query.user;

    var finalResult = {};

    dbcon.query(`select count(id) as NoLikes from likes where postId="${postId}";`,
        (err, result, fields) => {
            finalResult['likes'] = result[0]['NoLikes'];

            dbcon.query(`select count(username) as UserLikes from likes where postId="${postId}" and username="${username}"`,
                (err, result, fields) => {
                    finalResult['isLiked'] = result[0]['UserLikes'];
                    res.send(finalResult);
                });
        });
});

app.get('/readPostPhoto', (req, res) => {
    var postId = req.query.id;
    var name = req.query.name;

    if (fs.existsSync(__dirname + `/posts/${postId}/${name}`)) {
        res.sendFile(__dirname + `/posts/${postId}/${name}`);
    } else {
        res.send([]);
    }
});

app.get('/getPhotos', (req, res) => {
    var postId = req.query.id;

    fs.readdir(__dirname + `/posts/${postId}`, (err, files) => {
        if (err) {
            res.send([]);
        } else {
            var result = [];

            for (var i in files) {
                result.push(
                    `http://${HOST}/readPostPhoto?id=${postId}&name=${files[i]}`
                );
            }

            res.send(result);
        }
    });
});

app.post('/createArticle', uploader.array('photos', 20), (req, res) => {
    var postId = req.body.postId;
    var category = req.body.category;
    var articleJson = req.body.articleJson;
    var dict = JSON.parse(req.body.dictionary);

    var articleObj = JSON.parse(articleJson);

    for (let i in req.files) {
        let file = req.files[i];

        if (file.originalname == 'thumbnail.png') {
            fs.mkdir(__dirname + `/posts/${postId}`, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }

                fs.readFile(file.path, (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    fs.writeFile(__dirname + `/posts/${postId}/thumbnail.png`, data, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                });
            });
        } else {
            fs.mkdir(__dirname + `/posts/${postId}/${dict[i - 1]}`, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                    return;
                } else fs.readFile(file.path, (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else fs.writeFile(__dirname + `/posts/${postId}/${dict[i - 1]}/${i - 1}.png`, data, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                });
            });
        }
    }

    var articleTitle = JSON.stringify({
        en: articleObj['en'][0]['body'],
        ro: articleObj['ro'][0]['body']
    });

    dbcon.query(`insert into posts(post_type, title, category, imgfolder, articleField) values("article", '${articleTitle}', "${category}", "${postId}", '${articleJson}')`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log(`Article ${postId} created successfully!`);

            dbcon.query('select notifToken from users where 1',
                (err, results, fields) => {
                    var tokens = [];

                    for (var i in results) {
                        if (results[i]['notifToken'] != '') {
                            tokens.push(results[i]['notifToken']);
                        }
                    }

                    //console.log(tokens);

                    sendNotifications(tokens, 'Hooray 📈', `There is a new article in ${category}`,
                        `http://${HOST}/getArticleThumbnail?id=${postId}`);
                });
        });
});

app.get('/registerToken', (req, res) => {
    var token = req.query.token;
    var username = req.query.user;

    dbcon.query(`update users set notifToken='${token}' where username='${username}'`,
        (err, results, fields) => {
            if (err) {
                console.log(err);
            }

            res.send({ ok: true });
        });
});

app.post('/createPost', uploader.array('photos', 5), async (req, res) => {
    var postId = Date.now();

    fs.mkdir(__dirname + `/posts/${postId}`, { recursive: true }, (err) => {
        if (err) {
            res.send({ 'ok': false, 'errCode': 111 });
            console.log(err);
        } else {
            var ok = true;

            for (var i in req.files) {
                let file = req.files[i];

                fs.readFile(file.path, (err, data) => {
                    if (err) {
                        res.send({ 'ok': false, 'errCode': 222 });
                        ok = false;
                        console.log(err);
                    } else {
                        fs.writeFile(__dirname + `/posts/${postId}/${file.filename}.png`, data, (err) => {
                            if (err) {
                                res.send({ 'ok': false, 'errCode': 333 });
                                ok = false;
                                console.log(err);
                            }
                        });
                    }
                });
            }

            if (!ok) {
                return;
            }

            dbcon.query(`insert into posts(post_type, title, body, category, imgfolder) values("post", '${req.body.title}','${req.body.desc}',"${req.body.category}","${postId}")`,
                (err, result, fields) => {
                    if (err) {
                        console.log(err);
                        res.send({ 'ok': false, 'errCode': 444 });
                        ok = false;
                        console.log(err);
                    }
                });

            dbcon.query('select notifToken from users where 1',
                (err, results, fields) => {
                    var tokens = [];

                    for (var i in results) {
                        if (results[i]['notifToken'] != '') {
                            tokens.push(results[i]['notifToken']);
                        }
                    }

                    //console.log(tokens);

                    sendNotifications(tokens, 'Hooray 📈', `There is a new post in ${req.body.category}`, null);
                });

            if (!ok) {
                return;
            }

            res.send({ 'ok': true });

            console.log(`Post ${postId} successfully created!`);
        }
    });
});

app.get('/getPosts', (req, res) => {
    var category = req.query.category;
    var index = req.query.index;

    if (index == -1) {
        dbcon.query(`select id, post_type, body, title, imgfolder from posts where category='${category}' order by id desc limit 5`, (err, result, fields) => {
            res.send(result);
        });

    } else {
        dbcon.query(`select id, post_type, body, title, imgfolder from posts where category='${category}' and id < ${index} order by id desc limit 5`, (err, result, fields) => {
            res.send(result);
        });
    }
});

app.get('/login', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;

    dbcon.query(`select password, email from users where username='${username}'`, (err, result, fields) => {

        if (result.length == 0) {
            res.send({ 'ok': false, 'message': 'There is no such user' });
        } else if (password == md5(result[0]['password'])) {
            res.send({ 'ok': true, 'message': '', 'email': result[0]['email'] });
        } else if (password != md5(result[0]['password'])) {
            res.send({ 'ok': false, 'message': 'The entered password is incorrect' });
        }
    });
});

app.get('/register', (req, res) => {
    var username = req.query.username;
    var email = req.query.email;
    var password = req.query.password;

    dbcon.query(`select username from users where username='${username}'`, (err, result, fields) => {
        if (result.length != 0) {
            res.send({ 'ok': false, 'message': 'The entered username is taken' });
        } else {
            dbcon.query(`select email from users where email='${email}'`, (err, result, fields) => {
                if (result.length != 0) {
                    res.send({ 'ok': false, 'message': 'The entered email is taken' });
                } else {
                    dbcon.query(`insert into users(username, email, password) values('${username}','${email}','${password}')`, (err, result, fields) => {
                        res.send({ 'ok': true });
                    });
                }
            });
        }
    });
});

http.listen(40389, () => {
    console.log('Server started!');
});