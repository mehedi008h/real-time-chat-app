import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { FC } from "react";
import MessageHeader from "./Message/Header";
import MessageInput from "./Message/MessageInput";
import Messages from "./Message/Messages";
import NoConversation from "./NoConversationSelected";

interface IFeedWrapperProps {
    session: Session;
}

const FeedWrapper: FC<IFeedWrapperProps> = ({ session }) => {
    const router = useRouter();

    const { conversationId } = router.query;
    const {
        user: { id: userId },
    } = session;

    return (
        <Flex
            display={{ base: conversationId ? "flex" : "none", md: "flex" }}
            width="100%"
            direction="column"
        >
            {conversationId && typeof conversationId === "string" ? (
                <>
                    <Flex
                        direction="column"
                        justify="space-between"
                        overflow="hidden"
                        flexGrow={1}
                    >
                        <MessageHeader
                            userId={session.user.id}
                            conversationId={conversationId}
                        />
                        <Messages
                            userId={session.user.id}
                            conversationId={conversationId}
                        />
                    </Flex>
                    <MessageInput
                        session={session}
                        conversationId={conversationId}
                    />
                </>
            ) : (
                <NoConversation />
            )}
        </Flex>
    );
};

export default FeedWrapper;
