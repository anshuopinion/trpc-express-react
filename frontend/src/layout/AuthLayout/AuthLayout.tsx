import { Container, HStack, Image, Stack } from "@chakra-ui/react";
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <Container maxW="container.xl">
      <HStack
        mt="12"
        minH="410px"
        maxW={{ base: "full", md: "600px" }}
        mx={"auto"}
      >
        {children}
      </HStack>
    </Container>
  );
};

export default AuthLayout;
