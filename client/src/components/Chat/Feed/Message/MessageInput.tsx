import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC, useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { ObjectID } from "bson";
import { SendMessageArguments } from "../../../../../../server/src/utils/types";
import MessageOperation from "../../../../graphql/operations/message";
import { MessagesData } from "@/utils/types";

interface IMessageInputProps {
    session: Session;
    conversationId: string;
}

const MessageInput: FC<IMessageInputProps> = ({ session, conversationId }) => {
    // state
    const [messageBody, setMessageBody] = useState("");

    // send message mutation
    const [sendMessage] = useMutation<
        { sendMessage: boolean },
        SendMessageArguments
    >(MessageOperation.Mutation.sendMessage);

    const onSendMessage = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const { id: senderId } = session.user;
            const messageId = new ObjectID().toString();
            const newMessage: SendMessageArguments = {
                id: messageId,
                senderId,
                conversationId,
                body: messageBody,
            };

            // clear input
            setMessageBody("");

            const { data, errors } = await sendMessage({
                variables: {
                    ...newMessage,
                },
                // optimisticResponse: {
                //     sendMessage: true,
                // },
                // update: (caches) => {
                //     const existing = caches.readQuery<MessagesData>({
                //         query: MessageOperation.Query.messages,
                //         variables: { conversationId },
                //     }) as MessagesData;

                //     caches.writeQuery<MessagesData, { conversationId: string }>(
                //         {
                //             query: MessageOperation.Query.messages,
                //             variables: { conversationId },
                //             data: {
                //                 ...existing,
                //                 messages: [
                //                     {
                //                         id: messageId,
                //                         body: messageBody,
                //                         senderId: session.user.id,
                //                         conversationId,
                //                         sender: {
                //                             id: session.user.id,
                //                             username: session.user.username,
                //                         },
                //                         createdAt: new Date(Date.now()),
                //                         updatedAt: new Date(Date.now()),
                //                     },
                //                     ...existing.messages,
                //                 ],
                //             },
                //         }
                //     );
                // },
            });

            if (!data?.sendMessage || errors) {
                throw new Error("Faield to send message!");
            }
        } catch (error: any) {
            console.log("onSendMessage error", error);
            toast.error(error?.message);
        }
    };
    return (
        <Box px={4} py={6} width="100%">
            <form onSubmit={onSendMessage}>
                <Input
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                    placeholder="New message"
                    size="md"
                    resize="none"
                    _focus={{
                        boxShadow: "none",
                        border: "1px solid",
                        borderColor: "whiteAlpha.300",
                    }}
                />
            </form>
        </Box>
    );
};

export default MessageInput;
