let submit = document.querySelector('#submit');
let resultTitle = '';
let resultCover = '';
let resultAlbum = {};

function titleChange () {
    let getTitle = document.querySelector('#titleAlbum').value;
    resultTitle = getTitle;
}

function coverChange () {

    let cover = document.querySelector('#fileCover').files[0];
    let reader = new FileReader();

    reader.onload = function () {
        resultCover = reader.result
                            .replace("data:", "")
                            .replace(/^.+,/, "");
    }   
    
    reader.readAsDataURL(cover);
}

function albumChange () {
    
    let album = document.querySelector('#fileAlbum').files;

    for (let i = 0; i < album.length; i++) {
    
        let reader = new FileReader();
        reader.onload = function () {

            resultAlbum[i] = reader.result
                                .replace("data:", "")
                                .replace(/^.+,/, "");

        }
        reader.readAsDataURL(album[i]);

    }

}

submit.addEventListener('click', function () {

    let result = {

        title: resultTitle,
        cover: resultCover,
        album: resultAlbum,
    
    };
    
    fetch('/addAlbum', {

        method : 'POST',
        headers : {
            'Content-Type' : 'text/plain',
        },
        body : JSON.stringify(result),

    })
        .then((result) => result.text())
        .then((result) => {
           console.log(result);
           window.location = '/';
        })
        .catch((err) => console.log(err));

});