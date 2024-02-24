import React from "react";
import {
  Box,
  Button,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import AuthLayout from "../../layout/AuthLayout/AuthLayout";
import * as Yup from "yup";
import { InputControl } from "formik-chakra-ui";
import { trpc } from "../../../utils/trpc";
function ForgotPassword() {
  const toast = useToast();
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Check your email to reset password",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      <AuthLayout>
        <Box minH="410px" flex={"1"} boxShadow={"md"} borderRadius={"xl"}>
          <Stack py="3" px="4">
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={"1.1"}>
              Forgot Password
            </Text>

            <Formik
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Required"),
              })}
              initialValues={{
                email: "",
              }}
              onSubmit={async (values) => {
                forgotPasswordMutation.mutate({
                  email: values.email,
                });
              }}
            >
              <Form>
                <VStack spacing="3" mt="4">
                  <InputControl name="email" label="Email" />

                  <Button
                    w="full"
                    type="submit"
                    isLoading={forgotPasswordMutation.isPending}
                  >
                    Continue
                  </Button>
                </VStack>
              </Form>
            </Formik>
          </Stack>
          <HStack justify={"center"} mt="6">
            <Text>Don't have account?</Text>
            <Link href="/signup" color="primary">
              Sign up
            </Link>
          </HStack>
        </Box>
      </AuthLayout>
    </>
  );
}

export default ForgotPassword;
