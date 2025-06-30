import { createMcpHandler } from "@vercel/mcp-adapter";
import { getRedisUrl, isRedisAvailable } from "../../lib/redis";
import {
  echoTool,
  edaTool,
  edaToolJS,
} from "../../tools";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      echoTool.name,
      echoTool.description,
      echoTool.schema,
      echoTool.handler
    );

    server.tool(
      edaTool.name,
      edaTool.description,
      edaTool.schema,
      edaTool.handler
    );

    server.tool(
      edaToolJS.name,
      edaToolJS.description,
      edaToolJS.schema,
      edaToolJS.handler
    );
  },
  {},
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    ...(isRedisAvailable() && { redisUrl: getRedisUrl() }),
  }
);

export { handler as GET, handler as POST, handler as DELETE };
