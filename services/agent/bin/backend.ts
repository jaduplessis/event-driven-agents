#!/usr/bin/env node
import { getStage } from "@event-driven-agents/helpers/cdk";
import { App } from "aws-cdk-lib";
import "dotenv/config";

import { AgentStack } from "../lib/stack";

const app = new App();

const stage = getStage();

new AgentStack(app, `${stage}-agent-gpt`);
