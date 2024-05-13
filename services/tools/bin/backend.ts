#!/usr/bin/env node
import { getStage } from "@event-driven-agents/helpers/cdk";
import { App } from "aws-cdk-lib";
import "dotenv/config";

import { ToolsStack } from "../lib/stack";

const app = new App();

const stage = getStage();

new ToolsStack(app, `${stage}-tools-gpt`);
