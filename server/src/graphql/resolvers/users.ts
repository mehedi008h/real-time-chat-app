import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../utils/types";

const userResolvers = {
    Query: {
        searchUsers: async (
            _: any,
            args: { username: string },
            context: GraphQLContext
        ): Promise<Array<User>> => {
            const { username: searchUsername } = args;
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError("Not Authorized!");
            }

            const {
                user: { username: myUsername },
            } = session;

            try {
                // find user by username & not logged in user
                const users = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: searchUsername,
                            not: myUsername,
                            mode: "insensitive",
                        },
                    },
                });
                return users;
            } catch (error: any) {
                console.log("Search error:", error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        createUsername: async (
            _: any,
            args: { username: string },
            context: GraphQLContext
        ): Promise<CreateUsernameResponse> => {
            const { username } = args;
            const { prisma, session } = context;

            if (!session?.user) {
                return {
                    error: "Not Authorized!",
                };
            }

            const { id: userId } = session.user;

            try {
                // check the username is exist
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username,
                    },
                });

                if (existingUser) {
                    return {
                        error: "Username already taken, Try another 😢",
                    };
                }

                // update user
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        username,
                    },
                });

                return { success: true };
            } catch (error: any) {
                console.log("Create user error!", error);
                return {
                    error: error?.message,
                };
            }
        },
    },
};
export default userResolvers;
