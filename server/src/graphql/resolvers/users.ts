import { GraphQLContext } from "../../utils/types";

const userResolvers = {
    Query: {
        searchUsers: async (
            _: any,
            args: { username: string },
            context: GraphQLContext
        ) => {
            const { username: searchUsername } = args;
        },
    },
};
export default userResolvers;
