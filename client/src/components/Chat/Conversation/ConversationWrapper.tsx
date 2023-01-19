import {
    ConversationCreatedSubscriptionData,
    ConversationDeletedData,
    ConversationsData,
    ConversationUpdatedData,
} from "@/utils/types";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC, useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useRouter } from "next/router";
import { ParticipantPopulated } from "../../../../../server/src/utils/types";
import { toast } from "react-hot-toast";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: FC<IConversationWrapperProps> = ({ session }) => {
    const router = useRouter();

    const {
        query: { conversationId },
    } = router;

    const {
        user: { id: userId },
    } = session;

    // conversations query
    const {
        data: conversationsData,
        error: conversationsError,
        loading: conversationsLoading,
        subscribeToMore,
    } = useQuery<ConversationsData, null>(
        ConversationOperations.Queries.conversations
    );

    // mark conversation read mutation
    const [markConversationAsRead] = useMutation<
        { markConversationAsRead: boolean },
        { userId: string; conversationId: string }
    >(ConversationOperations.Mutations.markConversationAsRead);

    console.log("Conversation:", conversationsData);

    useSubscription<ConversationUpdatedData, null>(
        ConversationOperations.Subscriptions.conversationUpdated,
        {
            onData: ({ client, data }) => {
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                const {
                    conversationUpdated: { conversation: updatedConversation },
                } = subscriptionData;

                const currentlyViewingConversation =
                    updatedConversation.id === conversationId;

                if (currentlyViewingConversation) {
                    onViewConversation(conversationId as string, false);
                }
            },
        }
    );

    useSubscription<ConversationDeletedData, null>(
        ConversationOperations.Subscriptions.conversationDeleted,
        {
            onData: ({ client, data }) => {
                console.log("HERE IS SUB DATA", data);
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                const existing = client.readQuery<ConversationsData>({
                    query: ConversationOperations.Queries.conversations,
                });

                if (!existing) return;

                const { conversations } = existing;
                const {
                    conversationDeleted: { id: deletedConversationId },
                } = subscriptionData;

                client.writeQuery<ConversationsData>({
                    query: ConversationOperations.Queries.conversations,
                    data: {
                        conversations: conversations.filter(
                            (conversation) =>
                                conversation.id !== deletedConversationId
                        ),
                    },
                });

                router.push("/");
            },
        }
    );

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean | undefined
    ) => {
        /**
         * 1. Push the conversationId to the router query params
         */
        router.push({ query: { conversationId } });

        /**
         * 2. Mark the conversation as read
         */
        if (hasSeenLatestMessage) return;

        // markConversationAsRead mutation
        try {
            await markConversationAsRead({
                variables: {
                    userId,
                    conversationId,
                },
                optimisticResponse: {
                    markConversationAsRead: true,
                },
                update: (cache) => {
                    /**
                     * Get conversation participants from cache
                     */
                    const participantsFragment = cache.readFragment<{
                        participants: Array<ParticipantPopulated>;
                    }>({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment Participants on Conversation {
                                participants {
                                    user {
                                        id
                                        username
                                    }
                                    hasSeenLatestMessage
                                }
                            }
                        `,
                    });

                    if (!participantsFragment) return;

                    const participants = [...participantsFragment.participants];

                    const userParticipantIdx = participants.findIndex(
                        (p) => p.user.id === userId
                    );

                    if (userParticipantIdx === -1) return;

                    const userParticipant = participants[userParticipantIdx];

                    /**
                     * Update participant to show latest message as read
                     */
                    participants[userParticipantIdx] = {
                        ...userParticipant,
                        hasSeenLatestMessage: true,
                    };

                    /**
                     * Update cache
                     */
                    cache.writeFragment({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment UpdatedParticipant on Conversation {
                                participants
                            }
                        `,
                        data: {
                            participants,
                        },
                    });
                },
            });
        } catch (error) {
            console.log("onViewConversation error", error);
        }
    };

    const subscribeToNewConversations = () => {
        subscribeToMore({
            document: ConversationOperations.Subscriptions.conversationCreated,
            updateQuery: (
                prev,
                { subscriptionData }: ConversationCreatedSubscriptionData
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
        const unsubscribe = subscribeToNewConversations();

        return () => unsubscribe;
    }, []);

    if (conversationsError) {
        toast.error("There was an error fetching conversations");
        return null;
    }

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
