import React, {useEffect, useState} from 'react';
import {Box, Newline, render, Text, useApp, useInput} from 'ink';
import {Pages} from "./enum.ts";
import pairs from "./title.json";
import chalk from "chalk";
import {Play} from "./play.tsx";
import {Menu} from './menu.tsx';

function App() {
    const [page, setPage] = useState(Pages.MainMenu);
    const {exit} = useApp();

    useEffect(() => {
        if (page === Pages.Quit) exit();
    }, [page]);

    switch (page) {
        case Pages.MainMenu:
            return <Menu components={
                new Map([
                    // ["Play against CPU", Pages.PlayCPU],
                    ["Play with a friend", Pages.PlayHuman],
                    ["Quit", Pages.Quit],
                ])
            } onPageSelect={selected => setPage(selected)} title={pairs}/>
        case Pages.Quit:
            return
        case Pages.PlayHuman:
        case Pages.PlayCPU:
            return <Play
                onWinner={() => setPage(Pages.MainMenu)}
                againstHuman={page === Pages.PlayHuman}/>
        default:
            return <>
                <Text color="red">Unknown page state {page}</Text>
            </>
    }
}

// thanks https://github.com/vadimdemedes/ink/issues/263#issuecomment-600927688!
const enterAltScreenCommand = '\x1b[?1049h';
const leaveAltScreenCommand = '\x1b[?1049l';
process.stdout.write(enterAltScreenCommand);

const app = render(<App/>);
await app.waitUntilExit();
console.log(`thanks for playing! check out the source code @ ${chalk.underline(chalk.cyan("https://github.com/solithcy/pairs"))}`)
process.exit(0);