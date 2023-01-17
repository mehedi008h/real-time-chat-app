import gql from "graphql-tag";

const conversationTypeDefs = gql`
    scalar Date

    type Mutation {
        createConversation(participantIds: [String]): CreateConversationResponse
    }

    type CreateConversationResponse {
        conversationId: String
    }
`;

export default conversationTypeDefs;
