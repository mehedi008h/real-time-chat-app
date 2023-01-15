import { theme } from "@/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function App({
    Component,
    pageProps,
}: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={pageProps.session}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </SessionProvider>
    );
}
