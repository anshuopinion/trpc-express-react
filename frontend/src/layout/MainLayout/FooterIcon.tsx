import { HStack, Img } from "@chakra-ui/react";
import React from "react";
export default function FooterIcon() {
  const footerIcon = [
    { id: 1, icon: "/images/footer-icon1.svg" },
    { id: 5, icon: "/images/footer-icon5.svg" },
    { id: 3, icon: "/images/footer-icon3.svg" },
  ];
  return (
    <HStack w="full" justify="center" mt="12" gap="4" bg="bg" py="7">
      {footerIcon.map((icons) => (
        <Img src={icons.icon} key={icons.id} w="10" h="10" />
      ))}
    </HStack>
  );
}
