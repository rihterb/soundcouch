let username = document.getElementById('login');
let password = document.getElementById('pass');
let form = document.getElementById('loginform');
let btn = document.getElementById('logbtn');

// btn.onclick = function postLog() {
//     const formData = new FormData();
//     formData.append(username, password);
//     fetch('/fetch')
//         .then(response => {
//             if (response.status(200)) {
//                 window.location.href = "users";
//             } else {}
//         })
// }

form.addEventListener('submit', function(e) {
    console.log("On form submit");
    e.preventDefault(); // cancel page reload
    const formData = new FormData();
    formData.append("password", password.value);
    formData.append("username", username.value);
    console.log(formData);
    fetch("/auth/login/fetch", { method: 'POST', body: formData })
        .then(x => {
            if (x.ok) {
                console.log(x._id);
                window.location.href = "../users";
            } else {
                console.log('ERROR PASSWORD');
                username.setCustomValidity('Incorrect password or login!');
            }
        })
        .catch(console.error);
});