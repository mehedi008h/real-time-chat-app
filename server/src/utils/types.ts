import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { PubSub } from "graphql-subscriptions";
import {
    conversationPopulated,
    participantPopulated,
} from "../graphql/resolvers/conversations";
import { messagePopulated } from "../graphql/resolvers/message";
/**
 * Server configuration
 */

export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}

export interface Session {
    user: User;
    expires: ISODateString;
}

// Users
export interface User {
    id: string;
    username: string;
    image: string;
    emailVerified: boolean;
    email: string;
    name: string;
}

export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}

/**
 * Conversations
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include: typeof participantPopulated;
}>;

/**
 * Messages
 */
export interface SendMessageArguments {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
}

export interface MessageSentSubscriptionPayload {
    messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
    include: typeof messagePopulated;
}>;
