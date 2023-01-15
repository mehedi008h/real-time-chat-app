import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { RiChatSmile2Line } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { FC, useState } from "react";

interface AuthProps {}

const Auth: FC<AuthProps> = (props) => {
    // state
    const [show, setShow] = useState(false);
    const [signup, setSignup] = useState(false);

    // show password
    const handleClick = () => setShow(!show);
    return (
        <Flex height="100vh" width="100%" justify="space-between">
            <Box
                display={{ md: "flex", base: "none" }}
                bg="darkcyan"
                width="100%"
            ></Box>
            <Center width="100%">
                <Stack align="center" direction="column" gap={3}>
                    <RiChatSmile2Line size={60} color="darkcyan" />
                    <Text fontSize="3xl" fontWeight="bold">
                        Log In
                    </Text>
                    {/* social media login  */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        width="100&"
                    >
                        <Button
                            leftIcon={<FcGoogle size={20} />}
                            bg="blackAlpha.200"
                            width="300px"
                            _hover={{ bg: "blackAlpha.100" }}
                            px={4}
                            py={2}
                        >
                            Google
                        </Button>
                        <Button
                            leftIcon={<FaFacebook color="#4267B2" size={20} />}
                            bg="blackAlpha.200"
                            width="300px"
                            _hover={{ bg: "blackAlpha.100" }}
                            px={4}
                            py={2}
                        >
                            Facebook
                        </Button>
                    </Box>
                    <Text
                        color="blackAlpha.500"
                        fontSize={14}
                        textTransform="uppercase"
                    >
                        or with email
                    </Text>
                    <Stack width="300px" spacing={4}>
                        <Input
                            type="email"
                            border="1px"
                            borderColor="blackAlpha.500"
                            focusBorderColor="blackAlpha.500"
                            placeholder="Enter your email.."
                            _placeholder={{ color: "blackAlpha.500" }}
                            _hover={{ border: "1px" }}
                            _focus={{ border: "1px" }}
                        />
                        {signup && (
                            <Input
                                type="text"
                                border="1px"
                                borderColor="blackAlpha.500"
                                focusBorderColor="blackAlpha.500"
                                placeholder="Enter your name.."
                                _placeholder={{ color: "blackAlpha.500" }}
                                _hover={{ border: "1px" }}
                                _focus={{ border: "1px" }}
                            />
                        )}

                        <InputGroup size="md">
                            <Input
                                pr="4.5rem"
                                type={show ? "text" : "password"}
                                border="1px"
                                borderColor="blackAlpha.500"
                                focusBorderColor="blackAlpha.500"
                                placeholder="Enter your password.."
                                _placeholder={{ color: "blackAlpha.500" }}
                                _hover={{ border: "1px" }}
                                _focus={{ border: "1px" }}
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={handleClick}
                                    color="blackAlpha.600"
                                >
                                    {show ? (
                                        <AiOutlineEyeInvisible size={20} />
                                    ) : (
                                        <AiOutlineEye size={20} />
                                    )}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Button
                            bg="blue.600"
                            color="white"
                            _hover={{ bg: "blue.500" }}
                        >
                            {signup ? "Signup" : "Login"}
                        </Button>
                    </Stack>
                    <Button
                        color="blackAlpha.700"
                        fontSize={13}
                        textTransform="uppercase"
                        _hover={{ color: "blue.400" }}
                        onClick={() => setSignup(!signup)}
                    >
                        {signup
                            ? "Already have an account"
                            : "Don't have any account? Signup"}
                    </Button>
                </Stack>
            </Center>
        </Flex>
    );
};

export default Auth;
