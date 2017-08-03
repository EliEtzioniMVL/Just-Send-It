function writeUserData(name, telephone) {
    firebase.database().ref('users/' + telephone).set({
        username: name,
        telephone: telephone
    });
}

function handleSignup(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);

    writeUserData(data.get("name"), data.get("telephone"));
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);