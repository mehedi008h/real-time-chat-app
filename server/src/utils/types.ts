import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { PubSub } from "graphql-subscriptions";
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
