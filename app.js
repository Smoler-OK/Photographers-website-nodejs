import http from 'http';
import fs from 'fs';
import path from 'path';
import {auth as authentication} from "./authentication/auth.js";
import {v4 as uuid} from "uuid";
import {setCookie} from "./authentication/token.js";
import {isEmptyCurrentToken} from "./authentication/token.js";

let currentPath = path.resolve();

http.createServer( (req, res) => {
    let numAlbum = req.url.split('/')[2];
    let cookie = req.headers['cookie'];
    let token = cookie === undefined ? '' : getTokenFromCookies(cookie);

    if(req.url === '/auth') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            let client = JSON.parse(data);

            if(authentication(client)) {
                let createUUID = uuid(client.password);
                setCookie(createUUID);
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Set-Cookie': 'token=' + createUUID + '; max-age = 99999',
                })
                res.write('Accept!');
                res.end();
            } else {
                res.writeHead(401);
                res.write('No accept');
                res.end();
            }
        });
    }

    if(req.url === '/checkCookies') {
        if(isEmptyCurrentToken(token)) {
            res.end('ok');
        } else {
            res.end('not ok');
        }
    }

    if(req.method === 'GET') {
        if(req.url === '/') {
            getContentPage('index.html', 'text/html', res);
        } else if(req.url === '/about') {
            getContentPage('html_content_load/about.html', 'text/html', res);
        } else if(req.url === '/contacts') {
            getContentPage('html_content_load/contacts.html', 'text/html', res);
        } else if(req.url === '/album/' + numAlbum) {
            getContentPage('html_content_load/album.html', 'text/html', res);
        } else if(req.url === '/add_album') {
            getContentPage('html_content_load/add_album.html', 'text/html', res);
        } else if(req.url.split('/')[2] === 'album_length') {
            let result = fs.readdirSync('static/img_albums/' + req.url.split('/')[3]);
            res.end(result.toString());
        } else if(req.url === '/authentication') {
            getContentPage('html_content_load/authentication.html', 'text/html', res);
        } else {
            getContentPage(req.url, getContentType(req.url), res);
        }
    }

    if(req.method === 'POST' && isEmptyCurrentToken(token)) {
        if(req.url === '/addAlbum') {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                let receivedData = JSON.parse(data);

                let title = receivedData.title;
                let cover = receivedData.cover;
                let album = receivedData.album;

                writeDataTitle(title);
                writeDataCover(cover);
                writeDataAlbum(album);
            });
            res.end('album add');

        } else if(req.url === '/deleteAlbum') {

            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', (err) => {
               if(err) console.log(err);

               deleteTitle(data);
               deleteCover(data);
               deleteAlbum(data);
            });
            res.end('album delete');

        } else if(req.url === '/deleteAlbumImg') {

            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', (err) => {
                if(err) console.log(err);

                deleteAlbumImg(data);
            });
            res.end('album delete');

        } else if(req.url === '/addImageAlbum') {

            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', (err) => {
                if(err) console.log(err);
                let parseImageToJson = JSON.parse(data);
                pushImageAlbum(parseImageToJson);
            });
            res.end('Image adding as album');

        }
    }

}).listen(80, () => {console.log('start server');});

function pushImageAlbum(image) {

    let pathAlbums = currentPath + '/static/img_albums/' + image['albumNum'];

    fs.readdir(pathAlbums, (err, files) => {
        if(err) console.log(err);

        let fileArr = files.reverse();
        for(let file of fileArr) {

            let imgNum = +file.split('_')[1].split('.')[0];
            let oldPath = pathAlbums + '/' + file;
            let newPath = pathAlbums + '/' + image['albumNum'] + '_' + (imgNum + 1) + '.jpg';

            fs.renameSync(oldPath, newPath);
        }

        let buffer = new Buffer.from(image['image'], 'base64');

        fs.writeFileSync(pathAlbums + '/1_1.jpg', buffer);

    });

}

function getTokenFromCookies(cookies) {

    let cookieToArray = cookies.split(';');
    let jsonCookies = {};

    for(let cookie of cookieToArray) {

        let temp = cookie.trim().split('=');
        jsonCookies[temp[0]] = temp[1];

    }

    return jsonCookies['token'];
}

function deleteAlbumImg(imgName) {

    let parseImg = imgName.split('_');
    let albumNum = parseImg[0];

    fs.unlinkSync(currentPath + '/static/img_albums/' + albumNum + '/' + imgName);

}

function deleteTitle(num) {

    fs.readFile(currentPath + '/static/list_albums/albums.json', (err, data) => {

        if(err) console.log(err);
        let albumListJson = JSON.parse(data);
        delete albumListJson[num];
        let albumListToString = JSON.stringify(albumListJson);

        fs.writeFile(currentPath + '/static/list_albums/albums.json', albumListToString, (err) => {

            if(err) {console.log(err);}

        });

    });

}

function deleteCover(num) {
    fs.unlink(currentPath + '/static/img_covers/' + num + '.jpg', err => {
        if(err) console.log(err);
    });
}

function deleteAlbum(num) {

    fs.rmSync(currentPath + '/static/img_albums/' + num, {recursive: true, force: true});

}

function writeDataTitle(title) {

    fs.readFile(currentPath + '/static/list_albums/albums.json', (err, data) => {

        if(err) console.log(err);
        let albumListJson = JSON.parse(data);
        let numTitle = Object.keys(albumListJson).length;
        albumListJson[numTitle + 1] = {'title': title};
        let albumListToString = JSON.stringify(albumListJson);

        fs.writeFile(currentPath + '/static/list_albums/albums.json', albumListToString, (err) => {

            if(err) {console.log(err);}

        });

    });

}

function writeDataCover(cover) {

    fs.readdir(currentPath + '/static/img_covers', (err, files) => {

        if(err) console.log(err);

        let getLengthDir = files.length + 1;
        let buffer = new Buffer.from(cover, 'base64');

        fs.writeFile(currentPath + '/static/img_covers/' + getLengthDir + '.jpg', buffer, (err) => {

            if(err) console.log(err);

        });

    });

}

function writeDataAlbum(album) {
    
    let getLengthAlbums = Object.keys(album).length;

    fs.readdir(currentPath + '/static/img_covers', (err, files) => {

        if(err) console.log(err);

        let getLengthDirCovers = files.length;

        fs.mkdir(currentPath + '/static/img_albums/' + (getLengthDirCovers + 1), (err) => {

            if(err) console.log(err);

        });

        for(let i = 1; i <= getLengthAlbums; i++) {

            let buffer = new Buffer.from(album[i - 1], 'base64');

            fs.writeFile(currentPath + '/static/img_albums/' +
                        (getLengthDirCovers + 1) +
                        '/' + (getLengthDirCovers + 1) + '_' + i + '.jpg', buffer, (err) => {

                if(err) console.log(err);

            });

        }

    });

}

function getContentType(url) {
   
    switch (path.extname(url)) {
        
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        case  '.ico':
            return 'image/x-icon';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octate-stream';
    
    }

}

function getContentPage(file, contentType, res) {

    try {
        let fileInput = fs.readFileSync(currentPath + '/static/' + file);
        res.writeHead(200, {'Content-Type' : contentType});
        res.end(fileInput);
    } catch (err) {
        res.writeHead(404, {'Content-Type' : contentType});
        res.end();
    }

}