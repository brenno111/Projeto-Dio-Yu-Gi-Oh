const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        desc: document.getElementById("card-text"),
        texto1: document.getElementById("mytext"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
        texto2: document.getElementById("enemytext"),
    },
    playerSides:{
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX:document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";
const cardData = [

    {
        id: 0, 
        name: "Dragão Branco de olhos azuis",
        type:"Papel",
        img: `${pathImages}dragon.png`,
        Win:[1,4],
        Lose:[2,5],
    },

    {
        id: 1, 
        name: "Mago Negro",
        type:"Pedra",
        img: `${pathImages}magician.png`,
        Win:[2,5],
        Lose:[0,3],
    },

    {
        id: 2, 
        name: "Exodia",
        type:"Tesoura",
        img: `${pathImages}exodia.png`,
        Win:[0,3],
        Lose:[1,4],
    },

    {
        id: 3, 
        name: "Mago do Tempo",
        type:"Papel",
        img: `${pathImages}mago-do-tempo.png`,
        Win:[1,4],
        Lose:[2,5],
    },

    {
        id: 4, 
        name: "Feiticeira Negra",
        type:"Pedra",
        img: `${pathImages}feiticeira-negra.png`,
        Win:[2,5],
        Lose:[0,3],
    },

    {
        id: 5, 
        name: "Rei Caveira",
        type:"Tesoura",
        img: `${pathImages}rei-caveira.png`,
        Win:[0,3],
        Lose:[1,4],
    },

];


async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}


async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){

        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(IdCard);
            state.cardsSprites.desc.innerText = "";
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
    
        const typeText = state.cardsSprites.type.innerText;
        const typeAttribute = typeText.split(":")[1].trim();

        state.cardsSprites.texto1.innerText = typeAttribute;

        });

    }

    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardsFieldsImages(true);


    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);


    let duelResults = await checkDuelResults(cardId, computerCardId)
    await updateScore();
    await drawButton(duelResults);
    await textenemy();
}

async function drawCardsInfield(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    if (cardData[computerCardId].name === "Dragão Branco de olhos azuis") {
        state.fieldCards.texto2.innerText = "Papel";
    }
    if (cardData[computerCardId].name === "Mago Negro") {
        state.fieldCards.texto2.innerText = "Pedra";
    } 
    if (cardData[computerCardId].name === "Exodia") {
        state.fieldCards.texto2.innerText = "Tesoura";
    }

    if (cardData[computerCardId].name === "Mago do Tempo") {
        state.fieldCards.texto2.innerText = "Papel";
    }

    if (cardData[computerCardId].name === "Feiticeira Negra") {
        state.fieldCards.texto2.innerText = "Pedra";
    }

    if (cardData[computerCardId].name === "Rei Caveira") {
        state.fieldCards.texto2.innerText = "Tesoura";
    } 
}

async function showHiddenCardsFieldsImages(value){
    if(value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if(value === false){
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }
}

async function hiddenCardDetails(){
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
}

async function drawButton(text){
    state.actions.button.innerText = text
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Vitória: ${state.score.playerScore} | Derrota: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.Win.includes(computerCardId)){
        duelResults = "Ganhou"
        state.score.playerScore++;
    }

    if(playerCard.Lose.includes(computerCardId)){
        duelResults = "Perdeu";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages(){
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

     imgElements = player1BOX.querySelectorAll("img")
     imgElements.forEach((img) => img.remove());
        

}



async function drawSelectCard(index){
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Atributo: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
    
        document.getElementById(fieldSide).appendChild(cardImage);

    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.cardsSprites.texto1.innerText = "";
    state.fieldCards.texto2.innerText = "";
    state.cardsSprites.desc.innerText = "Selecione uma carta";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}



async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    
 try {
    audio.volume="0.3";
    audio.play();
 }  catch {}
} 

function init(){

    showHiddenCardsFieldsImages(false)
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.volume = "0.2";
    bgm.play();

}

init();
