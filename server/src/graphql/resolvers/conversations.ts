import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../utils/functions";
import {
    ConversationPopulated,
    ConversationUpdatedSubscriptionPayload,
    GraphQLContext,
} from "../../utils/types";

const resolver = {
    Query: {
        conversations: async (
            _: any,
            args: any,
            context: GraphQLContext
        ): Promise<Array<ConversationPopulated>> => {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError("Not authorized");
            }

            try {
                const { id } = session.user;

                const conversations = await prisma.conversation.findMany({
                    include: conversationPopulated,
                });

                return conversations.filter(
                    (conversation) =>
                        !!conversation.participants.find((p) => p.userId === id)
                );
            } catch (error: any) {
                console.log("Error", error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        createConversation: async (
            _: any,
            args: { participantIds: Array<string> },
            context: GraphQLContext
        ): Promise<{ conversationId: string }> => {
            const { session, prisma } = context;
            const { participantIds } = args;

            if (!session?.user) {
                throw new GraphQLError("Not Authorized!");
            }

            const {
                user: { id: userId },
            } = session;

            try {
                const conversation = prisma.conversation.create({
                    data: {
                        participants: {
                            createMany: {
                                data: participantIds.map((id) => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId,
                                })),
                            },
                        },
                    },
                    include: conversationPopulated,
                });

                return { conversationId: (await conversation).id };
            } catch (error) {
                console.log("Create conversation error!", error);
                throw new GraphQLError("Error creating conversation!");
            }
        },
    },
    Subscription: {
        conversationCreated: {
            // subscribe: (_: any, __: any, context: GraphQLContext) => {
            //     const { pubsub } = context;

            //     return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
            // },
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;

                    return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
                },
                (
                    payload: ConversationCreatedSubscriptionPayload,
                    _,
                    context: GraphQLContext
                ) => {
                    const { session } = context;
                    const {
                        conversationCreated: { participants },
                    } = payload;

                    const userIsParticipant = !!participants.find(
                        (p) => p.userId === session?.user?.id
                    );

                    return userIsParticipant;
                }
            ),
        },
        conversationUpdated: {
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;

                    return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
                },
                (
                    payload: ConversationUpdatedSubscriptionPayload,
                    _: any,
                    context: GraphQLContext
                ) => {
                    const { session } = context;

                    if (!session?.user) {
                        throw new GraphQLError("Not authorized");
                    }

                    const { id: userId } = session.user;
                    const {
                        conversationUpdated: {
                            conversation: { participants },
                        },
                    } = payload;

                    return userIsConversationParticipant(participants, userId);
                }
            ),
        },
    },
};

export interface ConversationCreatedSubscriptionPayload {
    conversationCreated: ConversationPopulated;
}

export const participantPopulated =
    Prisma.validator<Prisma.ConversationParticipantInclude>()({
        user: {
            select: {
                id: true,
                username: true,
            },
        },
    });

export const conversationPopulated =
    Prisma.validator<Prisma.ConversationInclude>()({
        participants: {
            include: participantPopulated,
        },
        latestMessage: {
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        },
    });

export default resolver;
