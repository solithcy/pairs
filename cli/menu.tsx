import {Pages} from "./enum.ts";
import React, {useState} from "react";
import {useInput, Box, Text, Newline} from "ink";

interface MenuProps {
    components: Map<string, Pages>
    title: string;
    onPageSelect: (selected: Pages) => void;
}

export function Menu({
    components,
    title,
    onPageSelect
}: MenuProps) {
    const [activeMenu, setActiveMenu] = useState(0);
    useInput((input, key) => {
        if(key.upArrow) setActiveMenu((activeMenu + components.size - 1) % components.size)
        if(key.downArrow) setActiveMenu((activeMenu + 1) % components.size)
        if(key.return) onPageSelect(Array.from(components.values())[activeMenu])
    });
    return (
        <Box alignItems="center" flexDirection="column" paddingTop={1}>
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
