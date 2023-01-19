import { formatUsernames } from "@/utils/functions";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { ConversationPopulated } from "../../../../../server/src/utils/types";

interface IConversationItemProps {
    userId: string;
    conversation: ConversationPopulated;
    onClick: () => void;
    isSelected: boolean;
    hasSeenLatestMessage: boolean | undefined;
}

const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
};

const ConversationItem: FC<IConversationItemProps> = ({
    userId,
    conversation,
    onClick,
    isSelected,
    hasSeenLatestMessage,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        if (event.type === "click") {
            onClick();
        } else if (event.type === "contextmenu") {
            event.preventDefault();
            setMenuOpen(true);
        }
    };
    return (
        <Stack
            direction="row"
            align="center"
            justify="space-between"
            p={4}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "whiteAlpha.200" }}
            position="relative"
            borderBottom="1px"
            borderColor="whiteAlpha.200"
            onClick={handleClick}
        >
            <Flex position="absolute" left="-6px">
                {hasSeenLatestMessage === false && (
                    <GoPrimitiveDot fontSize={18} color="#6B46C1" />
                )}
            </Flex>
            <Avatar name={formatUsernames(conversation.participants, userId)} />
            <Flex justify="space-between" width="80%" height="100%">
                <Flex direction="column" width="70%" height="100%">
                    <Text
                        fontWeight={600}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {formatUsernames(conversation.participants, userId)}
                    </Text>
                    {conversation.latestMessage && (
                        <Box width="140%" maxWidth="360px">
                            <Text
                                color="whiteAlpha.700"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {conversation.latestMessage.body}
                            </Text>
                        </Box>
                    )}
                </Flex>
                <Text
                    color="whiteAlpha.700"
                    textAlign="right"
                    position="absolute"
                    right={4}
                >
                    {formatRelative(
                        new Date(conversation.updatedAt),
                        new Date(),
                        {
                            locale: {
                                ...enUS,
                                formatRelative: (token) =>
                                    formatRelativeLocale[
                                        token as keyof typeof formatRelativeLocale
                                    ],
                            },
                        }
                    )}
                </Text>
            </Flex>
        </Stack>
    );
};

export default ConversationItem;
