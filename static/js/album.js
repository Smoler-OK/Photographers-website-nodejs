let content = document.querySelector('.content');
let getAlbumNum = window.location.pathname.split('/')[2];

fetch('album_length/' + getAlbumNum)
    .then((res) => res.text())
    .then((result) => {
    for(let i = 1; i <= result; i++) {
        let img = document.createElement('img');
        let div = document.createElement('div');
        img.src = '/img_albums/' + getAlbumNum + '/' + getAlbumNum + '_' + i + '.jpg';
        div.classList = 'album_list';
        div.appendChild(img);
        div.appendChild(img);
        content.appendChild(div);
    }
});

