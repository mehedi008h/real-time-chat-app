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
import React, { FC } from "react";

interface ISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: FC<ISearchModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#2d2d2d" pb={4}>
                <ModalHeader color="white">Create a conversation</ModalHeader>
                <ModalCloseButton color="red" />
                <ModalBody>
                    <form>
                        <Stack spacing={4}>
                            <Input
                                placeholder="Enter a username..."
                                color="whiteAlpha.700"
                            />
                            <Button type="submit" color="white">
                                Search
                            </Button>
                        </Stack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;
