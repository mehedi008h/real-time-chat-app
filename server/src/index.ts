import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext, Session } from "./utils/types";
async function startApolloServer() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    /*
    Context Parameter
    */
    const prisma = new PrismaClient();
    const pubsub = new PubSub();

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            // {
            //     async serverWillStart() {
            //         return {
            //             async drainServer() {
            //                 await serverCleanup.dispose();
            //             },
            //         };
            //     },
            // },
        ],
    });

    await server.start();

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    };

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server, {
            context: async ({ req }): Promise<GraphQLContext> => {
                const session = await getSession({ req });

                return { session: session as Session, prisma, pubsub };
            },
        })
    );

    const PORT = 4000;

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch((err) => console.log(err));
