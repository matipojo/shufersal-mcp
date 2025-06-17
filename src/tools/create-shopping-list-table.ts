import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerCreateShoppingListTableTool = (server: McpServer) => {
    const RecipeIngredient = z.object({
        ingredient: z.string().describe("Ingredient name"),
        quantity: z.string().describe("Quantity needed"),
        unit_of_measure: z.string().describe("Unit of measure (kg, liters, pieces, etc.)"),
        brand_name: z.string().optional().describe("Preferred brand name if available"),
    });

	server.registerTool(
		"create_shopping_list_table",
		{
			description: "Create a shopping list table in markdown format from recipe ingredients",
			inputSchema: {
				recipe: z.array(RecipeIngredient).describe("Array of recipe ingredients")
			}
		},
		async ({ recipe }: { recipe: z.infer<typeof RecipeIngredient>[] }) => {
			try {
				// Validate recipe format
				if (!Array.isArray(recipe)) {
					return {
						content: [{
							type: "text",
							text: "Recipe must be an array of ingredients",
						}],
						isError: true,
					};
				}

				return {
					content: [{
						type: "text",
						text: "Shopping list created successfully! You can now search for products on the Shufersal website and add them to your cart.",
					}],
				};
			} catch (error) {
				return {
					content: [{
						type: "text",
						text: `Error creating shopping list: ${(error as Error).message}`,
					}],
					isError: true,
				};
			}
		}
	);
};
