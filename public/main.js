const eventPopup = document.getElementById("event-popup");

function togglePopup() {
    eventPopup.classList.toggle('hide-popup');
}

function writeUserData(data, userId) {
    return firebase.database().ref('users/' + userId).set(data);
}

function handleSignup(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const num = data.get("telephone").replace(/[^\d]/g, '');
    const formData = {
        username: data.get("name"),
        telephone: num,
        zip:  data.get("zip")
    }

    writeUserData(formData, num).then(() => {
    	alert("Congrats, " + name + "! You will receive awesome adventures soon!");
        document.getElementById("signup").reset();
    }).catch((err) => {
        console.log(err);
    });
}

function writeEventData(data) {
    // Get a key for a new event.
    var newEventKey = firebase.database().ref().child('events').push().key;

    var updates = {};
    updates['/events/' + newEventKey] = data;

    return firebase.database().ref().update(updates);
}

function handleCreateEvent(evt) {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const formData = {
        organizer: data.get("organizer"),
        title: data.get("title"),
        description: data.get("description"),
        zip: data.get("zip"),
        meetspot: data.get("meetingpoint"),
        time: data.get("time"),
        starttime: data.get("hard-time")
    }

    writeEventData(formData).then(() => {
        eventPopup.classList.add('hide-popup');
    }).catch((err) => {
        console.log(err);
    })
}

document.getElementById("signup").addEventListener("submit", handleSignup, false);
document.getElementById("event-form").addEventListener("submit", handleCreateEvent, false);
document.getElementById("admin").addEventListener("click", togglePopup, false);