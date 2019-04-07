const options = {
    game: 'NOOP',
    interval: 0.5,
    BUTTON_TEXT_START: 'СТАРТ',
    BUTTON_TEXT_STOP: 'СТОП'
};

chrome.extension.sendRequest({ action: 'options' }, function (savedOptions) {
    Object.assign(options, savedOptions);
    addButton().addEventListener('click', handleClick);
});

function addButton() {
    const button = document.createElement('button');
    button.className = 'btn btn-lg btn-danger';
    button.textContent = options.BUTTON_TEXT_START;
    document.querySelector('.top_button_field').appendChild(button);
    return button;
}

function handleClick(event) {
    if (options.intervalID) {
        clearInterval(options.intervalID);
        delete options.intervalID;
        event.target.textContent = options.BUTTON_TEXT_START;
        return document.getElementById('stop').click();
    }

    const
        games = new Games(),
        name = 'play' + options.game;

    if (!games[name]) {
        throw new Error('Unknown game');
    }

    games[name]();
    options.intervalID = setInterval(games[name].bind(games), options.interval * 1000);
    event.target.textContent = options.BUTTON_TEXT_STOP;
}

class Games {
    constructor() {
        this.playButtons = [document.getElementById('low'), document.getElementById('high')];
        this.previousBalance = 0;
        this.balanceTag = document.querySelector('.currency_balance > .balance');
        this.betTableRow = document.querySelector('#table_check_bet tbody');
        this.betState = { minus: 0 };

        this.strategies = Array.from(document.querySelectorAll('.strategy'));
        if (!this.strategies.length) {
            throw new Error('No strategies');
        }
        this.playRandomStrategy();
    }

    balance = () => parseFloat(this.balanceTag.textContent).toFixed(8);
    randomItem = items => items[Math.floor(Math.random() * items.length)];
    currentStrategy = () => this.strategies
        .filter(e => e.style.boxShadow.length && e.style.boxShadow !== 'none')
        .shift();

    playNOOP() { }

    playRandomStrategy() {
        this.randomItem(this.strategies).click();
        this.randomItem(this.playButtons).click();
        console.log(this.balance());
    }

    playSwitch() {
        const row = this.betTableRow.querySelectorAll('tr:first-child td');
        if (!row.length) return;

        const betId = row[0].textContent;
        if (this.betState.id == betId) return;

        const
            profit = parseFloat(row[4].textContent).toFixed(8),
            win = profit > 0,
            s = this.currentStrategy().textContent;

        this.betState.id = betId;
        this.betState.profit = profit;

        if (!win) {
            this.betState.minus++;
        }

        if (

            ('30 50' == s && this.betState.minus > 10 && win) ||
            ('17 25' == s && this.betState.minus > 15 && win) ||
            ('40 100' == s && this.betState.minus > 6 && win)

        ) {
            this.betState.minus = 0;
            this.randomItem(this.strategies).click();
            while (this.currentStrategy().textContent == s) {
                this.randomItem(this.strategies).click();
            }
        }

        console.log('%c %s', `font-weight: bold; color: ${win ? 'green' : 'red'};`,
            this.betState.profit, 'minuses:', this.betState.minus, this.betState.id);
    }
}