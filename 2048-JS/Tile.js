export default class Tile {
    #tileElement
    #x
    #y
    #value

    constructor (tileContainer, value = Math.random() > 0.2 ? 2 : 4) {
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add("tile")
        tileContainer.append(this.#tileElement)
        this.value = value
    }

    set x(value) {
        this.#x = value
        this.#tileElement.style.setProperty("--x", value)
    }

    set y(value) {
        this.#y = value
        this.#tileElement.style.setProperty("--y", value)
    }

    set value(v) {
        this.#value = v
        this.#tileElement.textContent = v
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 5
        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
        this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`)
    }

    get value() {
        return this.#value
    }

    remove() {
        this.#tileElement.remove()
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, { once : true })
        })
    }
}