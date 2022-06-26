let userName = {
    name: ""
}


let keepLoggedIn = (answer) => {
    if(document.querySelector(".start-screen").classList.contains("hidden")) {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);
    }
}

function searchMessages () {
    if(document.querySelector(".start-screen").classList.contains("hidden")) {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promise.then(printMessages); 
    }
}

let startChat = () => {
    document.querySelector(".start-screen").classList.add("hidden");
    document.querySelector(".chat").classList.remove("hidden");
    
    keepLoggedIn();
    searchMessages();
}

function signIn () {
    userName.name = document.querySelector(".user-name").value;

    document.querySelector(".start-screen > div").innerHTML = `
        <img src="./img/Loadin_icon.gif" alt="Loading">
        <h3>Entrando...</h3>
    `;
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);

    promise.then(startChat);
    promise.catch(handleError);
}



function handleError (error) {
    alert("Este nome ja existe! Escolha outro.");
    window.location.reload();
}

setInterval(keepLoggedIn, 5000);

function printMessages (answer) {
    let msg = [];
    msg = answer.data;

    let content = document.querySelector(".msg-box");
    
    content.innerHTML = "";

    for(let i = 0 ; i < msg.length ; i++) {
        if(msg[i].type === "status"){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> ${msg[i].text}
                </div>
                `;
        }
        
        if(msg[i].type === "message"){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> para <strong>${msg[i].to}</strong>: ${msg[i].text}
                </div>
                `;
        }

        if(msg[i].type === "private_message" && msg[i].to === userName.name){
            content.innerHTML += `
                <div class="${msg[i].type}">
                    <span class="time">(${msg[i].time})</span>
                    <span class="text"><strong>${msg[i].from}</strong> reservadamente para <strong>${msg[i].to}</strong>: ${msg[i].text}
                </div>
                `;
        }
    }
    
    let lastMessage = document.querySelector(".msg-box").lastElementChild;
    lastMessage.scrollIntoView();

}

setInterval(searchMessages, 3000);

let onSend = () => {
    searchMessages();

    document.querySelector(".type-here").value = "";
}

function sendMessage () {
    const text = document.querySelector(".type-here").value;
    const msg = {
        from: userName.name,
        to: "Todos",
        text: text,
        type: "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);

    promise.then(onSend);
    promise.catch(window.location.reload);
}

document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        let button;
        if(document.querySelector(".start-screen").classList.contains("hidden")) {
            button = document.querySelector(".btn");
        }

        if(document.querySelector(".chat").classList.contains("hidden")) {
            button = document.querySelector(".enter");
        }
        button.click();
    }
 });

 function printParticipants (answer){
    let users = [];
    users = answer.data;

    let list = document.querySelector(".participants-list");
    
    for(let i = 0 ; i < users.length ; i ++) {
        list.innerHTML += `
            <div>
                <ion-icon name="person-circle"></ion-icon>
                <p>${users[i].name}</p>
            </div>
        `;
    }
 }

 function showParticipants () {
    document.body.innerHTML += `
        <div class="cover"></div>
     `;
    
    document.body.innerHTML += `
        <div class="participants-bar">
            <h5>Escolha um contato para enviar mensagem:</h5>

            <div class="participants-list">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                </div>
            </div>

            <h5>Escolha a visibilidade:</h5>

            <div class="visibility-options">
                <div>
                    <ion-icon name="lock-open"></ion-icon>
                    <p>Público</p>
                </div>
                <div>
                    <ion-icon name="lock-closed"></ion-icon>
                    <p>Reservadamente</p>
                </div>
            </div>
        </div>
     `;

     const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
     promise.then(printParticipants);
}
   

     
 
