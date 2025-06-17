#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	registerReadWebpageContentTool,
	registerCreateShoppingListTableTool,
	registerOpenShufersalTool,
	registerSearchShufersalTool,
	registerAddToShufersalCartTool
} from "./tools/index.js";
import { browserState } from "./browser.js";

/**
 * Initialize and configure the MCP server
 */
const server = new McpServer(
	{
		name: "shufersal-mcp-server",
		version: "0.0.1",
	},
	{
		capabilities: {
			resources: {},
			tools: {},
		},
	},
);

// Register all tools
registerReadWebpageContentTool(server);
registerCreateShoppingListTableTool(server);
registerOpenShufersalTool(server);
registerSearchShufersalTool(server);
registerAddToShufersalCartTool(server);

// Let the client read the console logs
server.resource(
	"console-logs",
	"console://logs",
	async () => ({
		contents: [{
			uri: "console://logs",
			mimeType: "text/plain",
			text: browserState.consoleLogs.join("\n"),
		}],
	})
);

/**
 * Start the MCP server
 */
async function runServer(): Promise<void> {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
	console.log("\nShutting down gracefully...");
	if (browserState.browser) {
		await browserState.browser.close();
	}
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("\nShutting down gracefully...");
	if (browserState.browser) {
		await browserState.browser.close();
	}
	process.exit(0);
});

// Start the server
runServer().catch((error) => {
	console.error("Failed to start server:", error);
	process.exit(1);
});
