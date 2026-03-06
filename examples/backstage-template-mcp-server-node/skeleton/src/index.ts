import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";

async function main() {
    const server = new McpServer({
        name: "ENTITY_BACKSTAGE_NAME",
        version: "1.0.0",
    });

    // Registrar tools
    registerTools(server);

    // Registrar prompts
    registerPrompts(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log("🚀 MCP Server up & running using stdio");
}

main().catch((err) => {
    console.error("❌ [MCP] Error fatal", err);
    process.exit(1);
});
