import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { ConversationPopulated, GraphQLContext } from "../../utils/types";

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
};

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
