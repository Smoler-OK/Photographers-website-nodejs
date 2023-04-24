let quote = document.querySelector('.quote');
let author = document.querySelector('.author');

fetch('https://api.api-ninjas.com/v1/quotes?category=good', {
    headers: {
        'X-Api-Key': 'Fs7OtAFIZNyFi1RJ54mu6w==AB5NcxZIyg9HuXt7',
    },
    'Content-Type': 'application/json'
})
    .then((res) => res.text())
    .then((text) => {
        let result = JSON.parse(text);
        author.innerHTML = result[0]['author'] + ':';
        quote.innerHTML = result[0]['quote'];
    });