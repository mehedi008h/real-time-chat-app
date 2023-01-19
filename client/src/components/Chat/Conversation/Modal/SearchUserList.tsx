import { SearchUser } from "@/utils/types";
import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { FC } from "react";

interface ISearchUserListProps {
    users: Array<SearchUser>;
    addParticipant: (user: SearchUser) => void;
}

const SearchUserList: FC<ISearchUserListProps> = ({
    users,
    addParticipant,
}) => {
    return (
        <Box>
            {users.length === 0 ? (
                <Flex mt={6} justify="center">
                    <Text>No user found</Text>
                </Flex>
            ) : (
                <Stack mt={6}>
                    {users.map((user) => (
                        <Stack
                            key={user?.id}
                            direction="row"
                            align="center"
                            spacing={4}
                            py={2}
                            px={4}
                            borderRadius={4}
                            _hover={{ bg: "whiteAlpha.200" }}
                        >
                            <Avatar name={user?.username} />
                            <Flex
                                justify="space-between"
                                align="center"
                                width="100%"
                            >
                                <Box>
                                    <Text fontSize={14} color="whiteAlpha.700">
                                        {user?.username}
                                    </Text>
                                </Box>
                                <Button
                                    bg="brand.100"
                                    _hover={{ bg: "brand.100" }}
                                    onClick={() => addParticipant(user)}
                                >
                                    Select
                                </Button>
                            </Flex>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default SearchUserList;
