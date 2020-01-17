let username = document.getElementById("login")

let password = document.getElementById("pass"),
    confirm_password = document.getElementById("repass");

let btn = document.getElementById("subbtn");
let form = document.getElementById("register");

function validatePassword() {
    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
// btn.onclick = validatePassword();
btn.onclick = function postSub() {

    return fetch('../../api/users/fetch').then(x => x.json())
        .then(users => {
            let check = 0;
            console.log(users);
            for (i = 0; i < users.length; i++) {
                if (users[i].login === username.value) {
                    check = 1;
                }
            }
            if (check == 1) {
                login.setCustomValidity('Username is already taken!');
            } else {
                form.submit();
            }
            // let check = 1;
            // for (i = 0; i < users.length; i++) {
            //     check = 1;
            // }
            // if (check == 0) {
            //     console.log('success');
            // } else {
            //     login.setCustomValidity('Username already taken.');
            // }
        })
        .catch(err => {
            console.log(err);
        });
}