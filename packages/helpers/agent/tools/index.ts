import { z } from "zod";

export const toolsEnumSchema = z.enum(["sendMessage", "queryTesco"]);

export type ToolsEnum = z.infer<typeof toolsEnumSchema>;
export const Tools = toolsEnumSchema.Values;

export * from "./queryTesco";
export * from "./sendMessage";
