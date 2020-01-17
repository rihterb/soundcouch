console.log('loaded');
let modal = document.getElementById('backModal');
let btn = document.getElementById("deletebutton");
let _close = document.getElementById("close");
btn.onclick = function() {
    modal.style.display = "block";
}
_close.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal)
        modal.style.display = "none";
}