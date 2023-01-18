import {
    ConversationPopulated,
    MessagePopulated,
} from "../../../server/src/utils/types";
export interface CreateUsernameVariables {
    username: string;
}

export interface CreateUsernameData {
    createUsername: {
        success: boolean;
        error: string;
    };
}

export interface SearchUserInput {
    username: string;
}

export interface SearchUserData {
    searchUsers: Array<SearchUser>;
}

export interface SearchUser {
    id: string;
    username: string;
    name: string;
}

/**
 * Conversations
 */

export interface CreateConversationData {
    createConversation: {
        conversationId: string;
    };
}

export interface ConversationsData {
    conversations: Array<ConversationPopulated>;
}

export interface CreateConversationInput {
    participantIds: Array<string>;
}

/**
 * Messages
 */
export interface MessagesData {
    messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
    conversationId: string;
}

export interface MessageSubscriptionData {
    subscriptionData: {
        data: {
            messageSent: MessagePopulated;
        };
    };
}
