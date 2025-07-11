const chars = [
    "👽",
    "💖",
    "🐡",
    "✈️",
    "👹",
    "🔋",
    "📀",
    "💐",
    "😾",
    "🗿",
    "🎈",
    "🐙"
]

export class Game {
    cards: Card[] = [];
    players: Player[];
    playerTurn = -1;
    turnChoices: number[] = [];
    constructor (isAgainstHuman: boolean){
        for (let symbol of chars){
            this.cards.push(new Card(symbol));
            this.cards.push(new Card(symbol));
        }
        this.players = [
            new Player(false),
            new Player(!isAgainstHuman)
        ]
    }

    shuffle(){
        for(let pass = 0; pass < 5; pass++){
            this.cards = this.cards.sort((c1, c2) => {
                if(c1.flipped) c1.flip();
                return Math.random() > 0.5 ? -1 : 1;
            });
        }
        this.playerTurn = 0;
    }

    pickCard(picked: number){
        if(this.cards[picked].flipped) return;
        this.cards[picked].flip();
        this.turnChoices.push(picked);
        if(this.turnChoices.length === 2){
            let c1 = this.cards[this.turnChoices[0]];
            let c2 = this.cards[this.turnChoices[1]];
            if(c1.value === c2.value){
                this.players[this.playerTurn].score++;
            }else{
                c1.flip();
                c2.flip();
                this.playerTurn = (this.playerTurn + 1) % this.players.length;
            }
            this.turnChoices = [];
        }
    }
}

export class Card {
    value: string;
    flipped = true;
    constructor(value: string){
        this.value = value;
    }

    flip(): boolean{
        return this.flipped = !this.flipped;
    }
}

export class Player {
    score = 0;
    isRobot: boolean;
    constructor(isRobot: boolean) {
        this.isRobot = isRobot;
    }
}