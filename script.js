let userName = {
    name: ""
}

function signIn () {
    userName.name = prompt("Qual o seu lindo nome?");
    
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);

    promise.then(success);
    promise.catch(handleError);
}

signIn();

function handleError (error) {
    alert("Este nome ja existe! Escolha outro.");
    signIn ();
}

let keepLoggedIn = () => axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);

setInterval(keepLoggedIn, 5000);
