//const SUITS = ["♠", "♣", "♥", "♦"]
const SUITS = ["clubs", "diamonds", "hearts", "spades"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const IMG_DIR = "./images/fronts/"

export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberofCards() {
        return this.cards.length
    }

    shuffle() {
        for (let i = this.numberofCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

    pop() {
        return this.cards.shift()
    }

    push(card) {
        return this.cards.push(card)
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
        this.id = suit + "_" + value
    }

    get id() {
        return this.id
    }

    set id(a) {
        this.card_id = a
    }

    genHTML() {
        const cardDiv = document.createElement('li')
        cardDiv.classList.add("card")
        cardDiv.setAttribute("style", "background-image: url(" + IMG_DIR + this.card_id + ".svg);")
        return cardDiv
    }

    genHTMLFaceDown() {
        const cardDiv = document.createElement('li')
        cardDiv.classList.add("card")
        cardDiv.setAttribute("style", "background-image: url(./images/card-back-red.svg);")
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit,value)
        })
    })
}