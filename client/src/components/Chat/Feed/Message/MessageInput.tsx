import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC, useState } from "react";

interface IMessageInputProps {
    session: Session;
    conversationId: string;
}

const MessageInput: FC<IMessageInputProps> = (props) => {
    const [messageBody, setMessageBody] = useState("");
    return (
        <Box px={4} py={6} width="100%">
            <form>
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
