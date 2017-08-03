function writeUserData(name, telephone) {
    firebase.database().ref('users/' + telephone).set({
        username: name,
        telephone: telephone
    });
}

function handleSignup(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const num = data.get("telephone").replace(/[^\d]/g, '');
    
    writeUserData(data.get("name"), num);
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);