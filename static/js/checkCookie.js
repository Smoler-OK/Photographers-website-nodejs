let cookie = document.cookie.split('=')[1];

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
            let menu = document.querySelector('.menu ul');
            let li = document.createElement('li');
            let liAuth = document.createElement('li');
            let a = document.createElement('a');
            a.innerText = 'Добавить альбом';
            a.href = '/add_album'
            a.className = 'menuItem addAlbum';
            liAuth.innerText = 'Вы авторизированы как модератор!';
            liAuth.style = 'color: green;';
            li.appendChild(a);
            menu.appendChild(li);
            menu.appendChild(liAuth);
        } else {

        }
    })
    .catch((err) => console.log(err));


