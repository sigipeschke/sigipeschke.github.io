import Deck from "./deck.js"

const CARD_VALUE_MAP = {
    "2" : 2,
    "3" : 3,
    "4" : 4,
    "5" : 5,
    "6" : 6,
    "7" : 7,
    "8" : 8,
    "9" : 9,
    "10" : 10,
    "J" : 10,
    "Q" : 10,
    "K" : 10,
    "A" : 11
}

class Player {
    #id

    constructor(id) {
        this.hand = new Deck([])
        this.#id = id
        this.dirHTML = document.querySelector(".play-card-slot-"+String(this.id)).querySelector(".hand")
    }

    get id() {
        return this.#id
    }

    set id(a) {
        this.#id = a
    }

    receiveCard(c) {
        this.hand.push(c)
        this.dirHTML.appendChild(c.genHTML())
        this.updateHandSizeCSS()
    }

    receiveCardFaceDown(c) {
        this.hand.push(c)
        this.dirHTML.appendChild(c.genHTMLFaceDown())
        this.updateHandSizeCSS()
    }

    Hit() {
        const c = gameDeck.pop()
        this.receiveCard(c)
    }

    updateHandSizeCSS() {
        this.dirHTML.style.setProperty("--hand-size", this.dirHTML.childElementCount)
    }

    calcPlayerVal() {
        let aces = 0
        let sum = 0
        let c_val
        for (let i = 0; i < this.hand.numberofCards; i++) {
            c_val = CARD_VALUE_MAP[this.hand.cards[i].value]
            if (c_val === 11) {aces = aces + 1}
            else {sum = sum + c_val}
        }
        while (aces > 0) {
            aces = aces - 1
            if ((sum + 11 < 21) && (sum + 11 + (aces-1) < 21)) {sum = sum + 11}
            else {sum = sum + 1}
        }
        return sum
    }

    dealerPlay() {
        this.dirHTML.removeChild(this.dirHTML.children[1])
        this.dirHTML.appendChild(this.hand.cards[1].genHTML())
        while (this.calcPlayerVal() < 17) {
            window.setTimeout(this.Hit(), 2000)
            //this.Hit()
        }
        const dealerSum = this.calcPlayerVal()
        if (dealerSum > 21) {
            document.querySelector(".active-player-text").textContent = "Dealer busts w/ " + String(dealerSum)
        }
        else {
            document.querySelector(".active-player-text").textContent = "Dealer has " + String(dealerSum)
        }
        inRound = false
        endRound()
    }
}

let gameDeck, playerList, activePlayer, inRound, cut

startGame()

document.querySelector(".deal-btn").addEventListener('click', () => {
    if (gameDeck.numberofCards < cut) {
        gameDeck = genDeck()
        cut = (Math.random() * 15) + 60
    }

    if (inRound) {return}
    else {
        clearBoard()
        dealCards()
        activePlayer = playerList[1]
    }
})

document.querySelector(".hit-btn").addEventListener('click', () => {
    if (inRound) {
        if (activePlayer.calcPlayerVal() <= 21) {
            activePlayer.Hit()
            if (activePlayer.calcPlayerVal() > 21) {
                document.querySelector(".bet-slot-"+String(activePlayer.id)).setAttribute("style", "background-color: red;")
                playerStand()
            }
        }
    }
    else {return}
})

document.querySelector(".stand-btn").addEventListener('click', () => {
    if (inRound) {
        playerStand()
    }
    else {return}
})

function startGame() {
    inRound = false
    gameDeck = genDeck()
    //console.log(gameDeck)
    cut = (Math.random() * 15) + 60
    playerList = genPlayers(5)
    //console.log(playerList)
}

function genDeck() {
    let deck = new Deck()
    const deck2 = new Deck()

    for (let j = 1; j < 6; j++) {
        let i
        for (let i = 0; i < deck2.numberofCards; i++) {
            deck.push(deck2.cards[i])
        }
    }
    deck.shuffle()
    return deck
}

function genPlayers(num = 1) {
    let p = new Player(0)
    const playList = [p]
    for (let i = 1; i <= num; i++) {
        p = new Player(i)
        playList.push(p)
    }
    return playList
}

function dealCards() {
    inRound = true
    document.querySelector(".active-player-text").textContent = "Player 1"
    for (let j = 1; j <= 2; j++) {
        for (let p = playerList.length - 1; p >= 0; p--) {
            let c = gameDeck.pop()
            if (j === 2 && p === 0) {playerList[p].receiveCardFaceDown(c)}
            else {playerList[p].receiveCard(c)}
        }
    }
}

function playerStand() {
    if (activePlayer.id < playerList.length - 1) {
        activePlayer = playerList[activePlayer.id + 1]
        document.querySelector(".active-player-text").textContent = "Player " + String(activePlayer.id)
    }
    else {
        activePlayer = playerList[0]
        document.querySelector(".active-player-text").textContent = "Dealer plays"
        activePlayer.dealerPlay()
    }
}

function endRound() {
    for (let p = playerList.length - 1; p > 0; p--) {
        if (isRoundWinner(playerList[p])) {document.querySelector(".bet-slot-"+String(playerList[p].id)).setAttribute("style", "background-color: green;")}
        else {document.querySelector(".bet-slot-"+String(playerList[p].id)).setAttribute("style", "background-color: red;")}
    }
}

function isRoundWinner(p1) {
    if (p1.calcPlayerVal() <= 21) {
        if (playerList[0].calcPlayerVal() > 21) {return true}
        else if (p1.calcPlayerVal() >= playerList[0].calcPlayerVal()) {return true}
        else {return false}
    }
    else {return false}
}

function clearBoard() {
    let i
    for (i in playerList) {
        playerList[i].hand = new Deck([])
        while (playerList[i].dirHTML.hasChildNodes()) {
            playerList[i].dirHTML.removeChild(playerList[i].dirHTML.firstChild)
            if (i != 0) {
                document.querySelector(".bet-slot-"+String(playerList[i].id)).setAttribute("style", "background-color: none;")
            }
        }
    }
}



function isGameOver(deck) {
    return 
}