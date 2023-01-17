/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";

const ConversationFeild = `
    id
    participants {
        user {
            id
            username
        }
        hasSeenLatestMessage
    }
    latestMessage {
        id
        sender {
            id
            username
        }
        body
        createdAt
    }
    updatedAt
`;
export default {
    Queries: {
        conversations: gql`
            query Conversations {
                conversations {
                    ${ConversationFeild}
                }
            }
        `,
    },
    Mutations: {
        createConversation: gql`
            mutation CreateConversation($participantIds: [String]!) {
                createConversation(participantIds: $participantIds) {
                    conversationId
                }
            }
        `,
    },
    Subscrriptions: {},
};
