import React from "react";
import {
  Button,
  Card,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { InputControl } from "formik-chakra-ui";
import useUser from "src/hook/useUser";
import AuthLayout from "src/layout/AuthLayout/AuthLayout";
import { trpc } from "src/utils/trpc";
function Signin() {
  const navigate = useNavigate();
  const { logIn } = useUser();
  const toast = useToast();
  const signinUserMutation = trpc.auth.signin.useMutation({
    onSuccess: (data) => {
      logIn(data);
      navigate("/dashboard");
    },
    onError: (err) => {
      toast({
        title: "An error occurred.",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      <AuthLayout>
        <Card minH="410px" flex="1">
          <Stack py="3" px="4">
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={"1.1"}>
              Sign In
            </Text>
            <HStack fontSize={"sm"}>
              <Text color="#9F9F9F">Don&apos;t have any account? </Text>
              <Link href="/signup" textDecor={"underline"} color={"primary"}>
                Sign up
              </Link>
            </HStack>

            <Formik
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Required"),
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Required"),
              })}
              initialValues={{
                email: "test1@test.com",
                password: "test123",
              }}
              onSubmit={async (values) => {
                signinUserMutation.mutate({
                  email: values.email,
                  password: values.password,
                });
              }}
            >
              <Form>
                <VStack spacing="3" mt="4">
                  <InputControl name="email" label="Email" />
                  <InputControl name="password" label="Password" />
                  <HStack justify="flex-end" w="full">
                    <Link href="/forgot-password" color={"primary"}>
                      Forgot password?
                    </Link>
                  </HStack>
                  <Button
                    fontSize="sm"
                    rounded="md"
                    textAlign="center"
                    w="full"
                    type="submit"
                    isLoading={signinUserMutation.isPending}
                  >
                    Sign In
                  </Button>
                </VStack>
              </Form>
            </Formik>
          </Stack>
        </Card>
      </AuthLayout>
    </>
  );
}

export default Signin;
