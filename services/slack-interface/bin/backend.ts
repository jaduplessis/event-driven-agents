#!/usr/bin/env node
import { getStage } from "@event-driven-agents/helpers/cdk";
import { App } from "aws-cdk-lib";
import "dotenv/config";

import { TranslateStack } from "../lib/stack";

const app = new App();

const stage = getStage();

new TranslateStack(app, `${stage}-traduire-gpt`);
