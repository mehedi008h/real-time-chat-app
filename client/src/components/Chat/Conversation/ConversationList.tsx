import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React, { FC, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import SearchModal from "./Modal/SearchModal";

interface IConversationListProps {
    session: Session;
}

const ConversationList: FC<IConversationListProps> = ({ session }) => {
    // modal state
    const [isOpen, setIsOpen] = useState(false);

    const { user } = session;

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    return (
        <Box position="relative" height="100%" px={4}>
            {/* heading  */}
            <Flex justify="space-between" alignItems="center">
                <Text color="white" fontSize={24} fontWeight="bold">
                    Inbox
                </Text>
                <BiSearchAlt2
                    color="white"
                    size={20}
                    cursor="pointer"
                    onClick={onOpen}
                />
            </Flex>
            {/* modal  */}
            <SearchModal isOpen={isOpen} onClose={onClose} session={session} />

            {/* conversation item  */}

            {/* logout  */}
            {user.name && (
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    width="100%"
                    px={4}
                >
                    <Flex justify="space-between" alignItems="center">
                        <Flex alignItems="center" gap={3}>
                            <Avatar name={user.name} />
                            <Box>
                                <Text color="white">{user.name}</Text>
                                <Text fontSize={12} color="whiteAlpha.600">
                                    {user.username}
                                </Text>
                            </Box>
                        </Flex>
                        <AiOutlineLogout
                            color="white"
                            size={25}
                            onClick={() => signOut()}
                            cursor="pointer"
                        />
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default ConversationList;
