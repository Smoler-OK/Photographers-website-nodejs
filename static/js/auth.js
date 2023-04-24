let submit = document.querySelector('#submit');

submit.addEventListener('click', () => {
    let login = document.querySelector('#login').value;
    let password = document.querySelector('#password').value;

    let client = {
      'login': login,
      'password': password,
    };

    fetch('/auth', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(client),
    })
    .then((res) => {
        return res.text();
    })
    .then((result) => {
        console.log(result);
        window.location.replace('/');
    })
    .catch((err) => console.log(err));

});