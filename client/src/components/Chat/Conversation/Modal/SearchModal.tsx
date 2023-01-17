import { SearchUserData, SearchUserInput } from "@/utils/types";
import { useLazyQuery } from "@apollo/client";
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
import React, { FC, FormEvent, useState } from "react";
import UserOperations from "../../../../graphql/operations/user";
import SearchUserList from "./SearchUserList";

interface ISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session;
}

const SearchModal: FC<ISearchModalProps> = ({ isOpen, onClose, session }) => {
    const [username, setUsername] = useState("");

    const [searchUsers, { data, error, loading }] = useLazyQuery<
        SearchUserData,
        SearchUserInput
    >(UserOperations.Queries.searchUsers);

    const onSearch = async (e: FormEvent) => {
        e.preventDefault();

        // search query
        searchUsers({ variables: { username } });
    };

    console.log("Data:", data);

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
                            <Button type="submit" color="white">
                                Search
                            </Button>
                        </Stack>
                    </form>

                    {/* search data  */}

                    {data?.searchUsers && (
                        <SearchUserList users={data?.searchUsers} />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
