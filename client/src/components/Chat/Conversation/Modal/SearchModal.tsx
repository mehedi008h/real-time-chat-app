import {
    CreateConversationData,
    CreateConversationInput,
    SearchUser,
    SearchUserData,
    SearchUserInput,
} from "@/utils/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC, FormEvent, useState, Fragment } from "react";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import Participants from "./Participants";
import SearchUserList from "./SearchUserList";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { date } from "yup/lib/locale";

interface ISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session;
}

const SearchModal: FC<ISearchModalProps> = ({ isOpen, onClose, session }) => {
    // state
    const [username, setUsername] = useState("");
    const [participants, setParticipants] = useState<Array<SearchUser>>([]);

    console.log("Parti", participants);

    const router = useRouter();

    const {
        user: { id: userId },
    } = session;
    // search query
    const [searchUsers, { data, error, loading }] = useLazyQuery<
        SearchUserData,
        SearchUserInput
    >(UserOperations.Queries.searchUsers);

    // create conversation mutation
    const [createConversation, { loading: createConversationLoading }] =
        useMutation<CreateConversationData, CreateConversationInput>(
            ConversationOperations.Mutations.createConversation
        );

    // create conversation function
    const onCreateConversation = async () => {
        const participantIds = [userId, ...participants.map((p) => p.id)];

        try {
            // create conversation mutation
            const { data } = await createConversation({
                variables: {
                    participantIds,
                },
            });

            if (!data?.createConversation) {
                throw new Error("Failed to create conversation!");
            }

            const {
                createConversation: { conversationId },
            } = data;

            router.push({ query: { conversationId } });

            // cleare state and close modal
            setParticipants([]);
            setUsername("");
            onClose();
        } catch (error: any) {
            console.log("On create conversation error!", error);
            toast.error(error?.message);
        }
    };

    // search user function
    const onSearch = async (e: FormEvent) => {
        e.preventDefault();

        // search query
        searchUsers({ variables: { username } });
    };

    // add & remove participants
    const addParticipant = (user: SearchUser) => {
        setParticipants((prev) => [...prev, user]);
        setUsername("");
    };
    const removeParticipant = (userId: string) => {
        setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#2d2d2d" pb={4}>
                <ModalHeader color="white">Create a conversation</ModalHeader>
                <ModalCloseButton color="red" />
                <ModalBody>
                    {/* search form  */}
                    <form onSubmit={onSearch}>
                        <Stack spacing={4}>
                            <Input
                                placeholder="Enter a username..."
                                color="whiteAlpha.700"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button
                                type="submit"
                                color="white"
                                isLoading={loading}
                            >
                                Search
                            </Button>
                        </Stack>
                    </form>

                    {/* search data  */}
                    {data?.searchUsers && (
                        <SearchUserList
                            users={data?.searchUsers}
                            addParticipant={addParticipant}
                        />
                    )}

                    {/* participants list  */}
                    {participants.length !== 0 && (
                        <Fragment>
                            <Participants
                                participants={participants}
                                removeParticipant={removeParticipant}
                            />
                            <Button
                                bg="green"
                                width="100%"
                                mt={6}
                                _hover={{ bg: "green" }}
                                isLoading={createConversationLoading}
                                onClick={onCreateConversation}
                            >
                                Create Conversation
                            </Button>
                        </Fragment>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
