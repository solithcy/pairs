import React, {useState, useEffect, Dispatch, SetStateAction, act} from 'react';
import {render, Text, useInput, Spacer, Box, Newline} from 'ink';
import {Pages} from "./enum.ts";
import pairs from "./title.json";

interface MenuProps {
    components: Map<string, Pages>
    title: string;
    onPageSelect: (selected: Pages) => void;
}

function Menu({
    components,
    title,
    onPageSelect
}: MenuProps) {
    const [activeMenu, setActiveMenu] = useState(0);
    useInput((input, key) => {
        if(key.upArrow) setActiveMenu((activeMenu + components.size - 1) % components.size)
        if(key.downArrow) setActiveMenu((activeMenu + 1) % components.size)
        if(key.return) onPageSelect(activeMenu)
    });
    return (
        <Box alignItems="center" flexDirection="column">
            <Text color={"green"}>{title}</Text>
            <Newline />
            <Box flexDirection="column" borderStyle="classic" borderColor="green" paddingX={1}>
                {Array.from(components.entries()).map(([title], pi) => {
                    return <Text key={`menu-component-${pi}`}
                            backgroundColor={pi === activeMenu ? "green" : ""}
                            color={pi === activeMenu ? "black" : "green"}>{title}</Text>
                })}
            </Box>
        </Box>
    )
}

function App() {
    const [page, setPage] = useState(Pages.MainMenu);

    switch (page) {
        case Pages.MainMenu:
            return <Menu components={
                new Map([
                    ["Play against CPU", Pages.PlayCPU],
                    ["Play with a friend", Pages.PlayHuman],
                    ["Quit", Pages.Quit],
                ])
            } onPageSelect={selected => setPage(selected)} title={pairs}/>
        case Pages.Quit:
            return
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
process.on('exit', () => {
    process.stdout.write(leaveAltScreenCommand);
});

const {waitUntilExit} = render(<App/>);
await waitUntilExit();
console.log("thanks for playing! check out the source code @ ")