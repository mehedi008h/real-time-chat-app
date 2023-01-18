import { formatUsernames } from "@/utils/functions";
import { ConversationsData } from "@/utils/types";
import { useQuery } from "@apollo/client";
import {
    Button,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { IoAddCircleOutline } from "react-icons/io5";
import ConversationOperations from "../../../../graphql/operations/conversation";

interface IMessageHeaderProps {
    userId: string;
    conversationId: string;
}

const MessageHeader: FC<IMessageHeaderProps> = ({ userId, conversationId }) => {
    const router = useRouter();
    const { data, loading } = useQuery<ConversationsData, null>(
        ConversationOperations.Queries.conversations
    );

    const conversation = data?.conversations.find(
        (conversation) => conversation.id === conversationId
    );

    if (data?.conversations && !loading && !conversation) {
        router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
    }

    return (
        <Stack
            direction="row"
            align="center"
            spacing={6}
            py={5}
            px={{ base: 4, md: 0 }}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
        >
            <Button
                display={{ md: "none" }}
                onClick={() =>
                    router.replace("?conversationId", "/", {
                        shallow: true,
                    })
                }
            >
                {"<"}
            </Button>
            {loading && <Text> Loading</Text>}
            {!conversation && !loading && <Text>Conversation Not Found</Text>}
            {conversation && (
                <Flex
                    justify="space-between"
                    width="100%"
                    alignItems="center"
                    pr={2}
                >
                    <Flex direction="row" gap={2}>
                        <Text color="whiteAlpha.600">To: </Text>
                        <Text fontWeight={600}>
                            {formatUsernames(conversation.participants, userId)}
                        </Text>
                    </Flex>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<CgMenuGridO />}
                            variant="outline"
                        />
                        <MenuList>
                            <MenuItem
                                icon={<IoAddCircleOutline />}
                                command="⌘T"
                            >
                                New Tab
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            )}
        </Stack>
    );
};

export default MessageHeader;
