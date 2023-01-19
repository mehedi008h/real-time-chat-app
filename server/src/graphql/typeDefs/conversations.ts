import gql from "graphql-tag";

const conversationTypeDefs = gql`
    scalar Date

    type Mutation {
        createConversation(participantIds: [String]): CreateConversationResponse
    }

    type CreateConversationResponse {
        conversationId: String
    }

    type ConversationUpdatedSubscriptionPayload {
        conversation: Conversation
    }

    type Message {
        id: String
        sender: User
        body: String
        createdAt: Date
    }

    type Conversation {
        id: String
        latestMessage: Message
        participants: [Participant]
        updatedAt: Date
    }

    type Participant {
        id: String
        user: User
        hasSeenLatestMessage: Boolean
    }

    type Query {
        conversations: [Conversation]
    }

    type Subscription {
        conversationCreated: Conversation
    }

    type Subscription {
        conversationUpdated: ConversationUpdatedSubscriptionPayload
    }
`;

export default conversationTypeDefs;
