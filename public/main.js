function writeUserData(name, telephone, zip) {
    firebase.database().ref('users/' + telephone).set({
        username: name,
        telephone: telephone,
        zip: zip
    }).then(() => {
        console.log("success " + name);
    }).catch((err) => {
        console.log(err);
    });
}

function showMessage(evt) {
	//console.log("showMessage")
	element = document.getElementById("hidden-message")

	//console.log(element)
	element.classList.remove("hidden")
	//document.getElementById("hidden-message").classList.add("message")
}

function handleSignup(evt) {
	console.log("handleSignup")
    evt.preventDefault();
    const data = new FormData(evt.target);
    const num = data.get("telephone").replace(/[^\d]/g, '');

    writeUserData(data.get("name"), num, data.get("zip"));
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);
document.getElementById("signup").addEventListener("submit", showMessage, false);