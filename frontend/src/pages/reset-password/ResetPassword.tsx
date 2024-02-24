import React from "react";
import { Button, Card, Stack, Text, VStack, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { InputControl } from "formik-chakra-ui";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "src/utils/trpc";
import AuthLayout from "src/layout/AuthLayout/AuthLayout";

function ResetPassword() {
  const toast = useToast();
  const params = useParams();
  const token = params?.token as string;

  const navigate = useNavigate();
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Reset password successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/signin");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/forgot-password");
    },
  });
  return (
    <>
      <AuthLayout>
        <Card minH="410px" flex={"1"}>
          <Stack py="3" px="4">
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={"1.1"}>
              Reset Password
            </Text>

            <Formik
              validationSchema={Yup.object({
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("password"), ""], "Passwords must match")
                  .required("Required"),
              })}
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              onSubmit={async (values) => {
                resetPasswordMutation.mutate({
                  token: token,

                  password: values.password,
                });
              }}
            >
              <Form>
                <VStack spacing="3" mt="4">
                  <InputControl name="password" label="Password" />
                  <InputControl
                    name="confirmPassword"
                    label="Confirm Password"
                  />

                  <Button
                    fontSize="sm"
                    rounded="md"
                    textAlign="center"
                    w="full"
                    type="submit"
                    isLoading={resetPasswordMutation.isPending}
                  >
                    Continue
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

export default ResetPassword;
