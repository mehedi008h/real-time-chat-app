import {
    GraphQLContext,
    MessagePopulated,
    SendMessageArguments,
} from "../../utils/types";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { conversationPopulated } from "./conversations";
import { userIsConversationParticipant } from "../../utils/functions";

const resolver = {
    Query: {
        messages: async function (
            _: any,
            args: { conversationId: string },
            context: GraphQLContext
        ): Promise<Array<MessagePopulated>> {
            const { session, prisma } = context;
            const { conversationId } = args;

            if (!session?.user) {
                throw new GraphQLError("Not authorized!");
            }

            const {
                user: { id: userId },
            } = session;
            // verify that user is a participant

            const conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                },
                include: conversationPopulated,
            });

            if (!conversation) {
                throw new GraphQLError("Conversation not found!");
            }

            const allowdToView = userIsConversationParticipant(
                conversation.participants,
                userId
            );

            if (!allowdToView) {
                throw new GraphQLError("Not Authorized!");
            }

            try {
                const messages = await prisma.message.findMany({
                    where: {
                        conversationId,
                    },
                    include: messagePopulated,
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return messages;
            } catch (error: any) {
                console.log("Messages error!", error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        sendMessage: async function (
            _: any,
            args: SendMessageArguments,
            context: GraphQLContext
        ): Promise<boolean> {
            const { session, pubsub, prisma } = context;
            const { id: messageId, senderId, conversationId, body } = args;

            if (!session?.user) {
                throw new GraphQLError("Not authorized!");
            }

            const { id: userId } = session.user;

            if (userId !== senderId) {
                throw new GraphQLError("Not authorized!");
            }

            try {
                const newMessage = await prisma.message.create({
                    data: {
                        id: messageId,
                        senderId,
                        conversationId,
                        body,
                    },
                    include: messagePopulated,
                });

                // find conversation participant entity
                const participant =
                    await prisma.conversationParticipant.findFirst({
                        where: {
                            userId,
                            conversationId,
                        },
                    });

                if (!participant) {
                    throw new GraphQLError("Participant does not exist");
                }

                // update conversation entity
                // const conversation = await prisma.conversation.update({
                //     where: {
                //         id: conversationId,
                //     },
                //     data: {
                //         latestMessageId: newMessage.id,
                //         participants: {
                //             update: {
                //                 where: {
                //                     id: participant.id,
                //                 },
                //                 data: {
                //                     hasSeenLatestMessage: true,
                //                 },
                //             },
                //             updateMany: {
                //                 where: {
                //                     NOT: {
                //                         userId,
                //                     },
                //                 },
                //                 data: {
                //                     hasSeenLatestMessage: false,
                //                 },
                //             },
                //         },
                //     },
                //     include: conversationPopulated,
                // });
            } catch (error) {
                console.log("send Message error", error);
                throw new GraphQLError("Error sending message!");
            }

            return true;
        },
    },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
    sender: {
        select: {
            id: true,
            username: true,
        },
    },
});

export default resolver;
