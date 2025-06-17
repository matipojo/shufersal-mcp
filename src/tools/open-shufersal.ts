import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ensureBrowser } from "../browser.js";
import { CONFIG } from "../config.js";

export const registerOpenShufersalTool = (server: McpServer) => {
	server.registerTool(
		"open_shufersal",
		{
			description: "Open the Shufersal website and prepare for shopping.",
			inputSchema: {
				hasCreatedShoppingList: z.boolean().describe("Whether a shopping list has been created beforehand")
			}
		},
		async ({ hasCreatedShoppingList }: { hasCreatedShoppingList: boolean }) => {
			try {
				if (!hasCreatedShoppingList) {
					return {
						content: [{
							type: "text",
							text: "Please create a shopping list before opening the Shufersal website",
						}],
						isError: true,
					};
				}

				const page = await ensureBrowser();
				await page.goto(CONFIG.SHUFERSAL_BASE_URL);

				return {
					content: [{
						type: "text",
						text: "Successfully opened Shufersal website.",
					}],
				};
			} catch (error) {
				return {
					content: [{
						type: "text",
						text: `Error opening Shufersal: ${(error as Error).message}`,
					}],
					isError: true,
				};
			}
		}
	);
}; 