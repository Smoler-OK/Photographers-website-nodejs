let token = [];

export function setCookie(value) {
    token.push(value);
}

export function isEmptyCurrentToken(currentToken) {
    let result = false;

    token.forEach((item) => {
        if(item === currentToken) {
            result = true;
        } else {
            result = false;
        }
    });

    return result;
}