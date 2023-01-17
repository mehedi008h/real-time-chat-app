import { gql } from "@apollo/client";

/* eslint-disable import/no-anonymous-default-export */
export default {
    Queries: {},
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
