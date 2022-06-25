let userName = {
    name: ""
}

let keepLoggedIn = (answer) => axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);

function searchMessages () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(printMessages); 
}

let startChat = () => {
    keepLoggedIn();
    searchMessages();
}

function signIn () {
    userName.name = prompt("Qual o seu lindo nome?");
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);

    promise.then(startChat);
    promise.catch(handleError);
}

signIn();

function handleError (error) {
    alert("Este nome ja existe! Escolha outro.");
    signIn ();
}



setInterval(keepLoggedIn, 5000);

function printMessages (answer) {
    let msg = [];
    msg = answer.data;

    let content = document.querySelector(".msg-box");
    
    content.innerHTML = "";

    for(i = 0 ; i < msg.length ; i++) {
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