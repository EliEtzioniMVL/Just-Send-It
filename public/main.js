function writeUserData(name, telephone, zip) {
    firebase.database().ref('users/' + telephone).set({
        username: name,
        telephone: telephone,
        zip: zip
    });
}

function handleSignup(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const num = data.get("telephone").replace(/[^\d]/g, '');

    writeUserData(data.get("name"), num, data.get("zip"));
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);