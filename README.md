# Shufersal MCP Server

A Model Context Protocol server that provides automated shopping capabilities for the Shufersal website using Puppeteer. This server enables LLMs to interact with Shufersal's online shopping platform, search for products, create shopping lists, and add items to your cart.

## Key Features

- **Product Search**: Search Shufersal's product catalog, logged in user will get personalized results 
- **Cart Management**: Add products to your Shufersal shopping cart
- **Browser Automation**: Seamless interaction with the Shufersal website
- **Shopping List Management**: Create structured shopping lists from web links (e.g. recipe links)
- **Console Monitoring**: Track console logs from the browser automation (for debugging)

## Workflow

1. **Create Shopping List**: Use `create_shopping_list_table` to create a shopping list from your request or recipe link
2. **Open Shufersal**: Use `open_shufersal` to navigate to the Shufersal website (login required)
3. **Search Products**: Use `search_shufersal` to find products matching your shopping list items
4. **Add to Cart**: Use `add_to_shufersal_cart` to add found products to your shopping cart

## Components

### Tools

- **open_shufersal**
  - Open the Shufersal website and prepare for shopping (requires user login)
  - Input: `hasCreatedShoppingList` (boolean): Whether a shopping list has been created beforehand

- **search_shufersal**
  - Search for products on Shufersal website (results sorted by purchase history)
  - Input: `query` (string): Product search query (e.g., 'milk', 'bread', 'tomatoes')

- **add_to_shufersal_cart**
  - Add a product to the shopping cart (must be used after searching)
  - Inputs:
    - `product_id` (string): Product ID from search results
    - `sellingMethod` (string): Selling method from search results
    - `qty` (number): Quantity to add to cart
    - `comment` (string, optional): Optional comment for the product

#### Extra Tools for paste a recipe link

- **read_webpage_content**
  - Read and convert webpage content to markdown format
  - Input: `url` (string): URL of the webpage to read

- **create_shopping_list_table**
  - Create a shopping list table in markdown format from recipe ingredients
  - Input: `recipe` (array): Array of recipe ingredients with name, quantity, unit of measure, and optional brand


### Resources

The server provides access to:

1. **Console Logs** (`console://logs`)
   - Browser console output in text format
   - Includes all console messages from the browser automation

## Configuration

Here's the Claude Desktop configuration to use the Shufersal MCP server:

```json
{
  "mcpServers": {
    "shufersal": {
      "command": "node",
      "args": ["<path/to/shufersal-mcp>/dist/index.js"],
    }
  }
}
```

With custrom user data directory:

```json
{
  "mcpServers": {
    "shufersal": {
      "command": "node",
      "args": ["<path/to/shufersal-mcp>/dist/index.js", "--user-data-dir=<path/to/custom/user/data>"],
    }
  }
}
```

Windows:

```json

{
  "mcpServers": {
    "shufersal": {
      "command": "<path/to/node>",
      "args": ["<path/to/shufersal-mcp>/dist/index.js"],
    }
  }
}
```

## Security Notice

**IMPORTANT**: This tool automates browser interactions with the Shufersal website and stores browser data locally. Please be aware:

- Browser session data is stored in `./puppeteer-user-data/` (excluded from git)
- If you log into Shufersal during first use, the tool will save your session data in the user data directory
- Only use this tool with trusted MCP clients

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run watch
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.