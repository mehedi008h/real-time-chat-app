import { ConversationsData } from "@/utils/types";
import { useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC, useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useRouter } from "next/router";
import { ConversationPopulated } from "../../../../../server/src/utils/types";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: FC<IConversationWrapperProps> = ({ session }) => {
    const router = useRouter();

    const {
        query: { conversationId },
    } = router;

    const {
        data: conversationsData,
        error: conversationsError,
        loading: conversationsLoading,
        subscribeToMore,
    } = useQuery<ConversationsData, null>(
        ConversationOperations.Queries.conversations
    );

    console.log("Conversation:", conversationsData);

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean | undefined
    ) => {
        /**
         * 1. Push the conversationId to the router query params
         */
        router.push({ query: { conversationId } });
    };

    const subscribeToNewConversations = () => {
        subscribeToMore({
            document: ConversationOperations.Subscrriptions.conversationCreated,
            updateQuery: (
                prev,
                {
                    subscriptionData,
                }: {
                    subscriptionData: {
                        data: { conversationCreated: ConversationPopulated };
                    };
                }
            ) => {
                if (!subscriptionData.data) return prev;
                const newConversation =
                    subscriptionData.data.conversationCreated;
                return Object.assign({}, prev, {
                    conversations: [newConversation, ...prev.conversations],
                });
            },
        });
    };

    /**
     * Excute subscription on mount
     */

    useEffect(() => {
        subscribeToNewConversations();
    }, []);

    return (
        <Box
            display={{ base: conversationId ? "none" : "flex", md: "flex" }}
            width={{ base: "100%", md: "450px" }}
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
                    onViewConversation={onViewConversation}
                />
            )}
        </Box>
    );
};

export default ConversationWrapper;
