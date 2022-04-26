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
    "J" : 11,
    "Q" : 12,
    "K" : 13,
    "A" : 14,
}

const compCardSlot = document.querySelector(".comp-card-slot")
const playCardSlot = document.querySelector(".play-card-slot")
const compDeckElement = document.querySelector(".comp-deck")
const playDeckElement = document.querySelector(".play-deck")
const textDisp = document.querySelector(".text-display")

let playDeck, compDeck, inRound, stop

document.querySelector(".deal-btn").addEventListener('click', () => {
    if (stop) {
        startGame()
        return
    }

    if (inRound) {cleanBeforeRound()}
    else {flipCards()}
})

startGame()

function startGame() {
    const deck = new Deck()
    deck.shuffle()

    const deckMidpoint = Math.ceil(deck.numberofCards / 2)
    playDeck = new Deck(deck.cards.slice(0, deckMidpoint))
    compDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberofCards))
    inRound = false
    stop = false


    cleanBeforeRound()
}

function cleanBeforeRound() {
    inRound = false
    compCardSlot.innerHTML = ''
    playCardSlot.innerHTML = ''
    textDisp.innerText = ''

    updateDeckCount()
}

function updateDeckCount() {
    compDeckElement.innerText = compDeck.numberofCards
    playDeckElement.innerText = playDeck.numberofCards
}

function flipCards() {
    inRound = true
    const playCard = playDeck.pop()
    const compCard = compDeck.pop()

    playCardSlot.appendChild(playCard.genHTML())
    compCardSlot.appendChild(compCard.genHTML())

    updateDeckCount()

    if (isRoundWinner(playCard, compCard)) {
        textDisp.innerText = "Win"
        playDeck.push(playCard)
        playDeck.push(compCard)
    } 
    else if (isRoundWinner(compCard, playCard)) {
        textDisp.innerText = "Lose"
        compDeck.push(compCard)
        compDeck.push(playCard)
    }
    else {
        textDisp.innerText = "Draw"
        playDeck.push(playCard)
        compDeck.push(compCard)
    }

    if (isGameOver(playDeck)) {
        textDisp.innerText = "You Lost the War!!!"
        stop = true
    }
    else if (isGameOver(compDeck)) {
        textDisp.innerText = "You Won the War!!!"
        stop = true
    }
}

function isRoundWinner(c1, c2) {
    return CARD_VALUE_MAP[c1.value] > CARD_VALUE_MAP[c2.value]
}

function isGameOver(deck) {
    return deck.numberofCards === 0
}