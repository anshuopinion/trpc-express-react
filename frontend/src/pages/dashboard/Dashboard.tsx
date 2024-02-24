import { Box, Button, Text } from "@chakra-ui/react";
import useUser from "../../hook/useUser";
import { trpc } from "src/utils/trpc";

function Dashboard() {
  const { user } = useUser();

  const userMe = trpc.auth.me.useQuery();
  console.log(userMe.data);

  return (
    <Box>
      <Button>Zerodha</Button>
      <Button colorScheme="red">Kotak</Button>
    </Box>
  );
}

export default Dashboard;
