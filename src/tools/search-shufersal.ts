import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ensureBrowser, executeScript } from "../browser.js";
import { CONFIG } from "../config.js";
import { SearchApiResponse, SearchResultItem } from "../types.shufersal.js";

export const registerSearchShufersalTool = (server: McpServer) => {
	server.registerTool(
		"search_shufersal",
		{
			description: "Search for products on Shufersal website. Results are sorted by previous purchase history.",
			inputSchema: {
				query: z.string().describe("Product search query (e.g., 'milk', 'bread', 'tomatoes')")
			}
		},
		async ({ query }: { query: string }) => {
			try {
				const page = await ensureBrowser();
				const currentUrl = page.url();

				if (!currentUrl.includes("shufersal")) {
					return {
						content: [{
							type: "text" as const,
							text: "Please open the Shufersal website first using the 'open_shufersal' tool",
						}],
						isError: true,
					};
				}

				const searchFunction = async (runArgs: { query: string, baseUrl: string, searchLimit: number }) => {
					const urlObject = new URL(`${runArgs.baseUrl}search/results`);
					urlObject.searchParams.set("q", runArgs.query);
					urlObject.searchParams.set("limit", runArgs.searchLimit.toString());

					const response = await fetch(urlObject.toString(), {
						headers: {
							"accept": "application/json",
							"x-requested-with": "XMLHttpRequest"
						},
						referrer: runArgs.baseUrl,
						referrerPolicy: "strict-origin-when-cross-origin",
						method: "GET",
						mode: "cors",
						credentials: "include"
					});

					return await response.json();
				};

				const result = await executeScript(searchFunction, [{
					query,
					baseUrl: CONFIG.SHUFERSAL_BASE_URL,
					searchLimit: CONFIG.SEARCH_ITEMS_LIMIT,
				}]);
				const apiResponse = result.result as SearchApiResponse;

				if (!apiResponse?.results) {
					return {
						content: [{
							type: "text" as const,
							text: `No results found for query: ${query}`,
						}],
					};
				}

				// Pick only the needed fields
				const items: SearchResultItem[] = apiResponse.results.map((item) => ({
					code: item.code,
					name: item.name,
					price: item.price,
					sellingMethod: item.sellingMethod,
					unitDescription: item.unitDescription,
					brandName: item.brandName,
					secondLevelCategory: item.secondLevelCategory,
				}));

				return {
					content: [{
						type: "text",
						text: `Search results for "${query}":\n${JSON.stringify(items, null, 2)}\n\nConsole output:\n${result.logs.join("\n")}`,
					}],
				};
			} catch (error) {
				return {
					content: [{
						type: "text",
						text: `Error searching products: ${(error as Error).message}`,
					}],
					isError: true,
				};
			}
		}
	);
}; 