import { gql } from "graphql-tag";

const userTypeDefs = gql`
    scalar Date

    type User {
        id: String
        username: String
        name: String
        email: String
        emailVerified: Boolean
        image: String
    }

    type SearchedUser {
        id: String
        username: String
        name: String
    }

    type Query {
        searchUsers(username: String!): [SearchedUser]
    }
    type Mutation {
        createUsername(username: String!): CreateUsernameResponse
    }
    type CreateUsernameResponse {
        success: Boolean
        error: String
    }
`;

export default userTypeDefs;
