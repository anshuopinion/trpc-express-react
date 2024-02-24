"use client";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import {
  THEME_COLOR_COLOR_PRIMARY,
  THEME_COLOR_COLOR_SECONDARY,
} from "../constants";

const baseStyle = defineStyle({
  fontWeight: "medium",
  fontSize: "sm",
  px: "3",
  borderRadius: "md",
});

const solid = defineStyle({
  color: "white",
  fontSize: "sm",
});
const gray = defineStyle({
  color: "white",
  fontSize: "sm",
  boxShadow: "md",
  border: "0.3px solid",
  borderColor: "gray.400",
  bg: "gray.600",
  _hover: {
    boxShadow: "md",
    border: "0.3px solid",
    borderColor: "gray.400",
    bg: "gray.500",
  },
});

const link = defineStyle({
  color: "white",
  _hover: {
    color: THEME_COLOR_COLOR_PRIMARY,
  },
});

const primary = defineStyle({
  bg: THEME_COLOR_COLOR_PRIMARY,
  border: "1px solid",
  borderColor: "gray.400",
  color: "white",
  _hover: {
    bg: THEME_COLOR_COLOR_SECONDARY,
    color: "white",
    border: "1px solid",
  },
});

const menu = defineStyle({
  border: "1px solid",
  borderColor: "gray.400",
  color: "white",
  _hover: {
    bg: THEME_COLOR_COLOR_SECONDARY,
    color: "white",
    border: "1px solid",
  },
});

const ghostOutline = defineStyle({
  bg: "transparent",
  border: "1px solid",
  // variant: "ghost",
  color: "white",
  _hover: {
    color: THEME_COLOR_COLOR_SECONDARY,
    border: "1px solid",
  },
});
const ghost = defineStyle({
  bg: "transparent",
  color: "gray.500",
  _hover: {
    color: "white",
  },
});

const secondary = defineStyle({
  bg: THEME_COLOR_COLOR_PRIMARY,
  border: "1px solid",
  borderColor: "gray.400",
  color: "white",
  _hover: {
    bg: "blue.500",
    color: "white",
    border: "1px solid",
    borderColor: "transparent",
  },
});

const button = defineStyleConfig({
  baseStyle,
  variants: {
    solid,
    gray,
    link,
    menu,
    secondary,
    ghostOutline,
    primary,
    ghost,
  },
});

export default button;
