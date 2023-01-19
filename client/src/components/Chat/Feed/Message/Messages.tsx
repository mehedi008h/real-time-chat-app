import SkeletonLoader from "@/components/common/SkeletonLoader";
import {
    MessagesData,
    MessageSubscriptionData,
    MessagesVariables,
} from "@/utils/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import MessageOperation from "../../../../graphql/operations/message";
import MessageItem from "./MessageItem";

interface IMessagesProps {
    userId: string;
    conversationId: string;
}

const Messages: FC<IMessagesProps> = ({ userId, conversationId }) => {
    const { data, loading, error, subscribeToMore } = useQuery<
        MessagesData,
        MessagesVariables
    >(MessageOperation.Query.messages, {
        variables: {
            conversationId,
        },
        onError: ({ message }) => {
            toast.error(message);
        },
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const subscribeToMoreMessages = (conversationId: string) => {
        return subscribeToMore({
            document: MessageOperation.Subscription.messageSent,
            variables: {
                conversationId,
            },
            updateQuery: (
                prev,
                { subscriptionData }: MessageSubscriptionData
            ) => {
                if (!subscriptionData) return prev;

                const newMessage = subscriptionData.data.messageSent;

                return Object.assign({}, prev, {
                    messages:
                        newMessage.sender.id === userId
                            ? prev.messages
                            : [newMessage, ...prev.messages],
                });
            },
        });
    };

    useEffect(() => {
        const unsubscribe = subscribeToMoreMessages(conversationId);

        return () => unsubscribe();
    }, [conversationId]);

    useEffect(() => {
        if (!messagesEndRef.current || !data) return;
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [data, messagesEndRef.current]);

    console.log("Message Data: ", data);
    if (error) {
        return null;
    }
    return (
        <Flex direction="column" justify="flex-end" overflow="hidden">
            {loading ? (
                <Stack spacing={4} px={4}>
                    <SkeletonLoader count={4} height="60px" />
                </Stack>
            ) : (
                <Flex
                    direction="column-reverse"
                    overflowY="scroll"
                    height="100%"
                >
                    {data?.messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            sentByMe={message.sender.id === userId}
                        />
                    ))}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;
