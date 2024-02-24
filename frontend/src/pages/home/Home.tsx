import { Box, Heading, List, ListItem, Stack, VStack } from "@chakra-ui/react";
import React from "react";

const Home = () => {
  const goldenRatioValue = 0.2611;
  const firstCandleHigh = 10;
  const firstCandleLow = 5;

  const topLineValue = firstCandleHigh + (firstCandleHigh % 0.2611);
  

  return (
    <Box>
      <Stack mx="auto" mt="8" w="390px">
        <Heading>This is trpc template</Heading>
        <List>
          <ListItem>VITE TS</ListItem>
          <ListItem>React</ListItem>
          <ListItem>Chakra UI</ListItem>
          <ListItem>TRPC</ListItem>
          <ListItem>Express</ListItem>
          <ListItem>Mongodb</ListItem>
          <ListItem>Prisma</ListItem>
          <ListItem>Yup</ListItem>
          <ListItem>Formik</ListItem>
          <ListItem>Docker Support</ListItem>
        </List>
        <Heading>This is trpc template</Heading>
      </Stack>
    </Box>
  );
};

export default Home;
