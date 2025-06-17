/**
 * Configuration constants for the Shufersal MCP server
 */
export const CONFIG = {
	SHUFERSAL_BASE_URL: "https://www.shufersal.co.il/online/he/",
	USER_DATA_DIR: process.env.PUPPETEER_USER_DATA_DIR || "./puppeteer-user-data",
	SEARCH_ITEMS_LIMIT: parseInt(process.env.SEARCH_ITEMS_LIMIT || "15"),
	DEFAULT_WAIT_TIMEOUT: parseInt(process.env.DEFAULT_WAIT_TIMEOUT || "2000"),
};