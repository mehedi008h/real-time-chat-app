import merge from "lodash.merge";
import userResolvers from "./users";

const resolvers = merge({}, userResolvers);

export default resolvers;
