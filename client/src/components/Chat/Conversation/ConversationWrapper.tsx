import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC } from "react";
import ConversationList from "./ConversationList";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: FC<IConversationWrapperProps> = ({ session }) => {
    return (
        <Box
            display="flex"
            width={{ base: "100%", md: "400px" }}
            flexDirection="column"
            bg="blackAlpha.900"
            gap={4}
            py={6}
            px={3}
        >
            <ConversationList session={session} />
        </Box>
    );
};

export default ConversationWrapper;
