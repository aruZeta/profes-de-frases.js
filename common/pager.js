class Pager {
    #pages = [];
    #actualPage = 0;
    #actualAddPage = 0;
    #maxLength = 800;
    
    constructor(maxLength) {
        if (maxLength !== undefined) {
            if (maxLength > 1024) {
                throw 'Cannot embed text bigger than 1024 characters in discord.';
            }
            
            this.#maxLength = maxLength;
        }
    }

    get size() {
        return this.#pages.length;
    }

    get actualPage() {
        return this.#actualPage;
    }

    get actualPageText() {
        return this.#pages[this.#actualPage];
    }

    isFirstPage() {
        return this.#actualPage == 0;
    }

    isLastPage() {
        return this.#actualPage == this.size - 1;
    }

    nextPage() {
        this.#actualPage++;
    }

    previousPage() {
        this.#actualPage--;
    }

    #pageTextTooBig(textLength) {
        return this.#pages[this.#actualAddPage].length
            + textLength
            >= this.#maxLength;
    }

    add(text) {
        if (this.#pages.length == 0) {
            this.#pages.push(text);
        } else if (this.#pageTextTooBig(text.length)) {
            this.#pages.push(text);
            this.#actualAddPage++;
        } else {
            this.#pages[this.#actualAddPage] += text;
        }
    }
}

module.exports = {
    Pager
}
