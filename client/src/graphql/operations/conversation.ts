/* eslint-disable import/no-anonymous-default-export */
import { gql } from "@apollo/client";
import { MessageFields } from "./message";

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
        ${MessageFields}
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
        deleteConversation: gql`
            mutation DeleteConversation($conversationId: String!) {
                deleteConversation(conversationId: $conversationId)
            }
        `,
        markConversationAsRead: gql`
            mutation MarkConversationAsRead(
                $userId: String!
                $conversationId: String!
            ) {
                markConversationAsRead(
                    userId: $userId
                    conversationId: $conversationId
                )
            }
        `,
    },
    Subscriptions: {
        conversationCreated: gql`
          subscription ConversationCreated {
            conversationCreated {
              ${ConversationFeild}
            }
          }
        `,
        conversationUpdated: gql`
            subscription ConversationUpdated {
                conversationUpdated {
                    conversation {
                    ${ConversationFeild}
                    }
                }
            }
      `,
        conversationDeleted: gql`
            subscription ConversationDeleted {
                conversationDeleted {
                    id
                }
            }
        `,
    },
};
