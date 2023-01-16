import {
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
import { Formik } from "formik";
import * as Yup from "yup";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useMutation } from "@apollo/client";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "@/utils/types";
import { toast } from "react-hot-toast";

interface AuthProps {
    session: Session | null;
    reloadSession: () => void;
}

interface Values {
    email: string;
    password: string;
}

// Creating schema
const schema = Yup.object().shape({
    email: Yup.string()
        .required("Email is a required field!")
        .email("Invalid email format!"),
    password: Yup.string()
        .required("Password is a required field!")
        .min(8, "Password must be at least 8 characters!"),
});

const Auth: FC<AuthProps> = ({ session, reloadSession }) => {
    // state
    const [show, setShow] = useState(false);
    const [signup, setSignup] = useState(false);

    const [username, setUsername] = useState("");

    // show password
    const handleClick = () => setShow(!show);
    const [createUsername, { loading, error }] = useMutation<
        CreateUsernameData,
        CreateUsernameVariables
    >(UserOperations.Mutations.createUsername);

    const onSubmit = async () => {
        try {
            const { data } = await createUsername({ variables: { username } });

            if (!data?.createUsername) {
                throw new Error();
            }

            if (data.createUsername.error) {
                const {
                    createUsername: { error },
                } = data;

                throw new Error(error);
            }

            toast.success("Username successfull created ✔");

            // relode session to obtain new username
            reloadSession();
        } catch (error: any) {
            toast.error(error?.message);
            console.log("On Submit Error :", error);
        }
    };
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
                        {session ? "Create Username" : "Log In"}
                    </Text>

                    {session ? (
                        // create username
                        <Stack spacing={5}>
                            <Input
                                type="text"
                                border="1px"
                                borderColor="blackAlpha.500"
                                focusBorderColor="blackAlpha.500"
                                placeholder="Enter your username.."
                                _placeholder={{
                                    color: "blackAlpha.500",
                                }}
                                _hover={{ border: "1px" }}
                                _focus={{ border: "1px" }}
                                required
                                value={username}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => setUsername(event.target.value)}
                            />
                            <Button
                                bg="blue.600"
                                width="300px"
                                color="white"
                                _hover={{ bg: "blue.500" }}
                                onClick={onSubmit}
                                isLoading={loading}
                            >
                                Create
                            </Button>
                        </Stack>
                    ) : (
                        <>
                            {/* social media login  */}
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap={3}
                                width="100&"
                            >
                                <Button
                                    onClick={() => signIn("google")}
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
                                    leftIcon={
                                        <FaFacebook color="#4267B2" size={20} />
                                    }
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

                            <Formik
                                validationSchema={schema}
                                initialValues={{
                                    email: "",
                                    password: "",
                                }}
                                onSubmit={(values: Values) => {
                                    console.log(values);
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <Stack width="300px" spacing={4}>
                                            <Box>
                                                <Input
                                                    type="email"
                                                    border="1px"
                                                    borderColor={
                                                        errors.email &&
                                                        touched.email
                                                            ? "red"
                                                            : "blackAlpha.500"
                                                    }
                                                    focusBorderColor="blackAlpha.500"
                                                    placeholder="Enter your email.."
                                                    _placeholder={{
                                                        color: "blackAlpha.500",
                                                    }}
                                                    _hover={{ border: "1px" }}
                                                    _focus={{ border: "1px" }}
                                                    name="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                />
                                                {/* If validation is not passed show errors */}
                                                <Text
                                                    color="red.400"
                                                    fontSize={14}
                                                    marginTop={2}
                                                >
                                                    {errors.email &&
                                                        touched.email &&
                                                        errors.email}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <InputGroup size="md">
                                                    <Input
                                                        pr="4.5rem"
                                                        type={
                                                            show
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        border="1px"
                                                        borderColor={
                                                            errors.password &&
                                                            touched.password
                                                                ? "red"
                                                                : "blackAlpha.500"
                                                        }
                                                        focusBorderColor="blackAlpha.500"
                                                        placeholder="Enter your password.."
                                                        _placeholder={{
                                                            color: "blackAlpha.500",
                                                        }}
                                                        _hover={{
                                                            border: "1px",
                                                        }}
                                                        _focus={{
                                                            border: "1px",
                                                        }}
                                                        name="password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                    />
                                                    <InputRightElement width="4.5rem">
                                                        <Button
                                                            h="1.75rem"
                                                            size="sm"
                                                            onClick={
                                                                handleClick
                                                            }
                                                            color="blackAlpha.600"
                                                        >
                                                            {show ? (
                                                                <AiOutlineEyeInvisible
                                                                    size={20}
                                                                />
                                                            ) : (
                                                                <AiOutlineEye
                                                                    size={20}
                                                                />
                                                            )}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                {/* If validation is not passed show errors */}
                                                <Text
                                                    color="red.400"
                                                    fontSize={14}
                                                    marginTop={2}
                                                >
                                                    {errors.password &&
                                                        touched.password &&
                                                        errors.password}
                                                </Text>
                                            </Box>
                                            <Button
                                                type="submit"
                                                bg="blue.600"
                                                color="white"
                                                _hover={{ bg: "blue.500" }}
                                            >
                                                {signup ? "Signup" : "Login"}
                                            </Button>
                                        </Stack>
                                    </form>
                                )}
                            </Formik>

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
                        </>
                    )}
                </Stack>
            </Center>
        </Flex>
    );
};

export default Auth;
