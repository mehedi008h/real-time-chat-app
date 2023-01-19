import React, { useEffect } from "react";
import Auth from "@/components/Auth/Auth";
import Chat from "@/components/Chat/Chat";
import { Box, Text } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    console.log("Session : ", session);

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    useEffect(() => {
        if (!session?.user && router.query.conversationId) {
            router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
        }
    }, [session?.user, router.query]);
    return (
        <Box>
            {session && session?.user?.username ? (
                <Chat session={session} />
            ) : (
                <Auth session={session} reloadSession={reloadSession} />
            )}
        </Box>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
    return {
        props: {
            session,
        },
    };
}
