import { SearchUser } from "@/utils/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface IParticipantsProps {
    participants: Array<SearchUser>;
    removeParticipant: (userId: string) => void;
}

const Participants: FC<IParticipantsProps> = ({
    participants,
    removeParticipant,
}) => {
    return (
        <Flex mt={8} gap="10px" flexWrap="wrap">
            {participants.map((participant) => (
                <Stack
                    key={participant.id}
                    direction="row"
                    align="center"
                    bg="whiteAlpha.200"
                    borderRadius={4}
                    p={2}
                >
                    <Text>{participant.username}</Text>
                    <IoCloseCircleOutline
                        size={20}
                        cursor="pointer"
                        color="red"
                        onClick={() => removeParticipant(participant.id)}
                    />
                </Stack>
            ))}
        </Flex>
    );
};

export default Participants;
