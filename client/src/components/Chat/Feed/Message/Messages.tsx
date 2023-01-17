import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

interface IMessagesProps {
    userId: string;
    conversationId: string;
}

const Messages: FC<IMessagesProps> = ({ userId, conversationId }) => {
    return <Box></Box>;
};

export default Messages;
