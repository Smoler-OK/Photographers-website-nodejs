import {admin} from "../users/user.js";

export function auth(client) {
    let login = client.login;
    let password = client.password;
    let result;

    if(admin.login === login && admin.password === password) {
        result = true;
    } else {
        result = false;
    }

    return result;
}