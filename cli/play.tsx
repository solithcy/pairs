import {Pages} from "./enum.ts";
import {Game, Card} from "../engine/Game.ts";
import {useInput, Box, Text} from "ink";
import React, {act, useEffect, useState} from "react";

interface PlayProps {
    onWinner: () => void;
    againstHuman: boolean;
}

const gameWidth = 8;
enum TurnState {
    PickingCards,
    FeedbackPair,
    FeedbackNoPair
}

export function Play({
    againstHuman
}: PlayProps){
    const [game] = useState(new Game(againstHuman));
    const getChunks = (): Card[][] => {
        const newChunks = [];
        for(let i = 0; i < game.cards.length; i+=gameWidth){
            newChunks.push(game.cards.slice(i, i + gameWidth));
        }
        return newChunks;
    }

    const [activeCard, setActiveCard] = useState(0);
    const [playerTurn, setPlayerTurn] = useState(game.playerTurn)
    const [players, setPlayers] = useState(game.players);
    const [chunks, setChunks] = useState<Card[][]>(getChunks());
    const [turnState, setTurnState] = useState(TurnState.PickingCards);

    useInput(async (input, key) => {
        if(key.return && turnState !== TurnState.FeedbackNoPair){
            if(playerTurn === -1){
                game.shuffle();
            }else{
                let prevChoicesLen = game.turnChoices.length;
                let prevChoice = prevChoicesLen > 0 ? game.turnChoices[0] : 0;
                let prevScore = game.players[playerTurn].score;
                game.pickCard(activeCard);
                let newChoicesLen = game.turnChoices.length;
                let newScore = game.players[playerTurn].score;
                let successfulTurn = prevChoicesLen === 1 && newChoicesLen === 0;
                let foundPair = newScore > prevScore;
                if (successfulTurn){
                    // resetting cards to FLIPPED to display them before hiding if not a pair
                    game.cards[prevChoice].flipped = true;
                    game.cards[activeCard].flipped = true;
                    setChunks(getChunks());
                    setPlayers(game.players);
                    setTurnState(foundPair ? TurnState.FeedbackPair : TurnState.FeedbackNoPair);
                    await new Promise(r => setTimeout(r, 1500));
                    setTurnState(TurnState.PickingCards);
                    if(!foundPair){
                        game.cards[prevChoice].flipped = false;
                        game.cards[activeCard].flipped = false;
                    }
                }
            }
            if(playerTurn !== game.playerTurn) setActiveCard(0);
            setPlayerTurn(game.playerTurn);
            setPlayers(game.players);
            setChunks(getChunks());
            return;
        }
        let xMut = 0;
        let yMut = 0;
        const gameHeight = Math.ceil(game.cards.length / gameWidth);
        const activeRow = Math.floor(activeCard / gameWidth);
        const activeCol = activeCard % gameWidth;
        if(key.rightArrow) xMut++;
        if(key.leftArrow) xMut--;
        if(key.downArrow) yMut++;
        if(key.upArrow) yMut--;
        let newRow = activeRow + yMut;
        let newCol = activeCol + xMut;
        if(newRow !== activeRow && newRow >= 0 && newRow < gameHeight){
            setActiveCard(Math.min(game.cards.length-1, activeCard + yMut * gameWidth));
        }
        if(newCol !== activeCol && newCol >= 0 && newCol < gameWidth){
            setActiveCard(Math.min(game.cards.length-1, activeCard + xMut));
        }
    });

    return <Box alignItems="center" flexDirection="column" paddingTop={1}>
        <Box justifyContent={"space-between"} flexDirection="row" width={6*gameWidth-2}>
            {players.map((p, i) => {
                return <Box key={`pscore-${i}`}>
                    <Text
                        backgroundColor={playerTurn === i ? "green" : ""}
                        color={playerTurn === i ? "black" : "green"}
                    >P{i+1}: {p.score}</Text>
                </Box>
            })}
        </Box>
        {chunks.map((chunk, i) => {
            return <Box key={`chunk-${i}`}>
                {chunk.map((card, ci) => {
                    let cardIdx = i * gameWidth + ci;
                    let active = cardIdx === activeCard;
                    return <Box borderStyle="classic"
                        borderColor={playerTurn !== -1 && active ? "greenBright" : "green"}
                        key={`chunk-${i}-card-${ci}`}
                        marginX={1}>
                        <Text
                            backgroundColor={playerTurn !== -1 && active ? "green" : ""}
                            color={playerTurn !== -1 && active ? "black" : ""}
                        >{
                            card.flipped ? card.value : (cardIdx+1).toString().padStart(2, "0")
                        }</Text>
                    </Box>
                })}
            </Box>
        })}
        {playerTurn === -1 && <>
            <Text color="green">
                Press <Text backgroundColor="green" color="black">ENTER</Text> to shuffle the cards!
            </Text>
            <Text color="green" dimColor={true}>
                If the emojis don't appear in your terminal, press <Text backgroundColor="green" dimColor={true} color="black">DEL</Text>.
            </Text>
        </>}
        {playerTurn !== -1 && turnState === TurnState.PickingCards && <>
            <Text color="green">Use the arrow keys to pick 2 cards!</Text>
        </>}
        {playerTurn !== -1 && turnState === TurnState.FeedbackPair && <>
            <Text color="green">You found a pair! +1 point to P{playerTurn+1}</Text>
        </>}
        {playerTurn !== -1 && turnState === TurnState.FeedbackNoPair && <>
            <Text color="green">That's not a pair!</Text>
        </>}
    </Box>
}