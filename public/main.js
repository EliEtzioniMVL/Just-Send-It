function writeUserData(name, telephone) {
    firebase.database().ref('users/' + telephone).set({
        username: name,
        telephone: telephone
    });
}

function showMessage(evt) {
	//console.log("showMessage")
	element = document.getElementById("hidden-message")
	element.classList.remove("hidden")

	element = document.getElementById("container")
	element.classList.add("hidden")
	//document.getElementById("hidden-message").classList.add("message")
}

function handleSignup(evt) {
	console.log("handleSignup")
    evt.preventDefault();
    const data = new FormData(evt.target);
    const num = data.get("telephone").replace(/[^\d]/g, '');
    
    writeUserData(data.get("name"), num);
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);
document.getElementById("signup").addEventListener("submit", showMessage, false);