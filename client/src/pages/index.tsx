import Auth from "@/components/Auth/Auth";
import { Box, Text } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
export default function Home() {
    const { data: session } = useSession();

    console.log("Session : ", session);

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };
    return (
        <Box>
            <Auth session={session} reloadSession={reloadSession} />
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
