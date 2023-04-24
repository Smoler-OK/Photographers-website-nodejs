let cookie = document.cookie.split('=')[1];
let content = document.querySelector('.content');

function albumView() {
    fetch('/list_albums/albums.json')
        .then((res) => res.json())
        .then((json) => {
            for (let key in json) {
                let div = document.createElement('div');
                let work = document.createElement('div');
                let cover = document.createElement('a');
                let title = document.createElement('a');
                let img = document.createElement('img');
                let deleteButton = document.createElement('button');
                let deleteDiv = document.createElement('div');

                work.className = 'work';
                cover.className = 'cover';
                cover.href = '/album/' + key;
                title.className = 'title';
                title.href = '/album/' + key;
                div.innerHTML = json[key].title;
                img.className = 'cover';
                img.src = './img_covers/' + key + '.jpg';
                deleteDiv.className = 'deleteDiv';

                fetch('/checkCookies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plant'
                    },
                    body: cookie
                })
                    .then((response) => response.text())
                    .then((result) => {
                        if(result === 'ok') {
                            deleteButton.innerText = 'Удалить альбом - ' + key;
                            deleteButton.className = 'delete';
                            deleteButton.value = key;
                            deleteButton.onclick = function () {
                                fetch('/deleteAlbum', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'text/plain'
                                    },
                                    body: key
                                })
                                .then((res) => res.text())
                                .then((result) => {
                                    console.log(result);
                                    location.reload();
                                });
                            }
                        } else {

                        }
                    })
                    .catch((err) => console.log(err));
                

                deleteDiv.appendChild(deleteButton);
                work.appendChild(cover);
                work.appendChild(title);
                work.appendChild(deleteDiv);
                cover.appendChild(img);
                title.appendChild(div);

                content.appendChild(work);
            }
        }).catch((err) => {
            console.log(err);
        });
}

albumView();


