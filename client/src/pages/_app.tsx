import { theme } from "@/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Toaster } from "react-hot-toast";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/apollo-client";

export default function App({
    Component,
    pageProps,
}: AppProps<{ session: Session }>) {
    return (
        <ApolloProvider client={client}>
            <SessionProvider session={pageProps.session}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                    <Toaster />
                </ChakraProvider>
            </SessionProvider>
        </ApolloProvider>
    );
}
