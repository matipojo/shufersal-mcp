/**
 * Based on https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer
 */

import puppeteer, { Browser, Page } from "puppeteer";
import { CONFIG } from "./config.js";

// Extend the Window interface with mcpHelper property
declare global {
    interface Window {
        mcpHelper?: {
            logs: string[];
            originalConsole: {
                log: typeof console.log;
                info: typeof console.info;
                warn: typeof console.warn;
                error: typeof console.error;
            };
        };
    }
}

/**
 * Global state management
 */
class BrowserState {
    private _browser: Browser | undefined;
    private _page: Page | undefined;
    private _consoleLogs: string[] = [];

    get browser(): Browser | undefined {
        return this._browser;
    }

    get page(): Page | undefined {
        return this._page;
    }

    get consoleLogs(): string[] {
        return this._consoleLogs;
    }

    setBrowser(browser: Browser, page: Page): void {
        this._browser = browser;
        this._page = page;
    }

    addConsoleLog(log: string): void {
        this._consoleLogs.push(log);
    }
}

export const browserState = new BrowserState();

/**
 * Ensures browser is launched and returns the current page
 */
export async function ensureBrowser(): Promise<Page> {
    if (!browserState.browser) {
        const browser = await puppeteer.launch({
            args: ["--enable-save-password-bubble"],
            userDataDir: CONFIG.USER_DATA_DIR,
            headless: false,
        });

        const pages = await browser.pages();
        const page = pages[0];

        // Set up console logging
        page.on("console", (msg) => {
            const logEntry = `[${msg.type()}] ${msg.text()}`;
            browserState.addConsoleLog(logEntry);
        });

        browserState.setBrowser(browser, page);
    }

    return browserState.page!;
}

/**
 * Executes JavaScript in the browser context with console logging
 */
export async function executeScript<T = unknown, TArgs extends readonly unknown[] = unknown[]>(callback: (...args: TArgs) => T | Promise<T>, args: TArgs): Promise<{ result: Awaited<T>, logs: string[] }> {
    const script = `(${callback.toString()})(...${JSON.stringify(args)})`;
    const page = await ensureBrowser();

    // Set up console capturing
    await page.evaluate(() => {
        window.mcpHelper = {
            logs: [],
            originalConsole: {
                log: console.log,
                info: console.info,
                warn: console.warn,
                error: console.error,
            },
        };

        (["log", "info", "warn", "error"] as const).forEach(method => {
            console[method] = (...args: unknown[]) => {
                window.mcpHelper?.logs.push(`[${method}] ${args.join(" ")}`);
                window.mcpHelper?.originalConsole[method](...args);
            };
        });
    });

    const result = await page.evaluate(script) as Awaited<T>;

    // Restore console and get logs
    const logs = await page.evaluate(() => {
        Object.assign(console, window.mcpHelper?.originalConsole);
        const logs = window.mcpHelper?.logs || [];
        delete window.mcpHelper;
        return logs;
    });

    return { result, logs: logs || [] };
}
