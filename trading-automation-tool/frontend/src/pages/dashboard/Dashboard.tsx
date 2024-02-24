import { Box, Text } from "@chakra-ui/react";
import React from "react";
import useUser from "../../hook/useUser";

import { trpc } from "../../../utils/trpc";

function Dashboard() {
  const { user } = useUser();

  const userMe = trpc.auth.me.useQuery();
  console.log(userMe.data);

  return (
    <Box>
      Dashboard <Text>{user?.first_name}</Text>
    </Box>
  );
}

export default Dashboard;
