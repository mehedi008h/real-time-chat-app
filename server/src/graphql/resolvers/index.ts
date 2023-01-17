import merge from "lodash.merge";
import userResolvers from "./users";
import conversationResolvers from "./conversations";

const resolvers = merge({}, userResolvers, conversationResolvers);

export default resolvers;
