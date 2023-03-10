import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        styles: {
            global: () => ({
                body: {
                    bg: "white",
                    color: "white",
                },
            }),
        },
        fonts: {
            body: `'Poppins', sans-serif`,
        },
    }
);
