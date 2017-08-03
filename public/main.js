function handleSignup(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);

    firebase.database().ref().child("users").update
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);