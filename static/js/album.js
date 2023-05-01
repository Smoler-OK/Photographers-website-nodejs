let content = document.querySelector('.content');
let getAlbumNum = window.location.pathname.split('/')[2];

fetch('album_length/' + getAlbumNum)
    .then((res) => res.text())
    .then((result) => {

            let arrImg = result.split(',');

            let lb = document.querySelector('.lb');
            content.appendChild(lb);

            for(let imageName of arrImg) {

                    let a = document.createElement('a');
                    a.href = '/img_albums/' + getAlbumNum + '/' + imageName;
                    a.classList = 'album_list';

                    let img = document.createElement('img');
                    img.src = '/img_albums/' + getAlbumNum + '/' + imageName;

                    a.appendChild(img);
                    lb.appendChild(a);

                    fetch('/checkCookies', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'text/plant'
                                    },
                                    body: cookie
                                })
                                    .then((response) => response.text())
                                    .then((result) => {

                                        if(imageName === '') {
                                            fetch('/deleteAlbum', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'text/plain'
                                                },
                                                body: getAlbumNum
                                            })
                                                .then((res) => res.text())
                                                .then((result) => {
                                                    console.log(result);
                                                    window.location = '/';
                                                });
                                        }

                                        if (result === 'ok') {

                                            let deleteDiv = document.createElement('div');
                                            let deleteBtn = document.createElement('button');
                                            deleteDiv.appendChild(deleteBtn);
                                            deleteBtn.innerHTML = 'Удалить фото ';
                                            deleteBtn.value = imageName;
                                            deleteDiv.classList = 'deleteDiv';
                                            deleteBtn.classList = 'delete';
                                            deleteBtn.onclick = function () {
                                                fetch('/deleteAlbumImg', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'text/plain'
                                                    },
                                                    body: imageName
                                                })
                                                    .then((res) => res.text())
                                                    .then((result) => {
                                                        console.log(result);
                                                        location.reload();
                                                    });
                                            }
                                            a.appendChild(deleteDiv);
                                        } else {

                                        }
                                    })
                                    .catch((err) => console.log(err));
            }


        // for(let imageName of arrImg) {
        //
        //         let img = document.createElement('img');
        //         let div = document.createElement('div');
        //         img.src = '/img_albums/' + getAlbumNum + '/' + imageName;
        //
        //         div.classList = 'album_list';
        //         div.appendChild(img);
        //         div.appendChild(img);
        //
        //         fetch('/checkCookies', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'text/plant'
        //             },
        //             body: cookie
        //         })
        //             .then((response) => response.text())
        //             .then((result) => {
        //
        //                 if(imageName === '') {
        //                     fetch('/deleteAlbum', {
        //                         method: 'POST',
        //                         headers: {
        //                             'Content-Type': 'text/plain'
        //                         },
        //                         body: getAlbumNum
        //                     })
        //                         .then((res) => res.text())
        //                         .then((result) => {
        //                             console.log(result);
        //                             window.location = '/';
        //                         });
        //                 }
        //
        //                 if (result === 'ok') {
        //
        //                     let deleteDiv = document.createElement('div');
        //                     let deleteBtn = document.createElement('button');
        //                     deleteDiv.appendChild(deleteBtn);
        //                     deleteBtn.innerHTML = 'Удалить фото ';
        //                     deleteBtn.value = imageName;
        //                     deleteDiv.classList = 'deleteDiv';
        //                     deleteBtn.classList = 'delete';
        //                     deleteBtn.onclick = function () {
        //                         fetch('/deleteAlbumImg', {
        //                             method: 'POST',
        //                             headers: {
        //                                 'Content-Type': 'text/plain'
        //                             },
        //                             body: imageName
        //                         })
        //                             .then((res) => res.text())
        //                             .then((result) => {
        //                                 console.log(result);
        //                                 location.reload();
        //                             });
        //                     }
        //                     div.appendChild(deleteDiv);
        //                 } else {
        //
        //                 }
        //             })
        //             .catch((err) => console.log(err));
        //
        //         content.appendChild(div);
        //
        // }
});