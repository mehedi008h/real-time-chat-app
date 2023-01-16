import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC } from "react";
import ConversationWrapper from "./Conversation/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

interface IChatProps {
    session: Session;
}

const Chat: FC<IChatProps> = ({ session }) => {
    return (
        <Flex height="100vh" bg="blackAlpha.900">
            <ConversationWrapper session={session} />
            <FeedWrapper />
        </Flex>
    );
};

export default Chat;
