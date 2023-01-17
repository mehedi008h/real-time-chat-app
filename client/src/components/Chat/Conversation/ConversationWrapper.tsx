import { ConversationsData } from "@/utils/types";
import { useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: FC<IConversationWrapperProps> = ({ session }) => {
    const {
        data: conversationsData,
        error: conversationsError,
        loading: conversationsLoading,
    } = useQuery<ConversationsData, null>(
        ConversationOperations.Queries.conversations
    );

    console.log("Conversation:", conversationsData);

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
            {conversationsLoading ? (
                <Text>Loading</Text>
            ) : (
                <ConversationList
                    session={session}
                    conversations={conversationsData?.conversations || []}
                />
            )}
        </Box>
    );
};

export default ConversationWrapper;
