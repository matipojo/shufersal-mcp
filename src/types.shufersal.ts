declare global {
    interface Window {
        ajaxCall: (
            url: string,
            data: string,
            success: () => void,
            error: null,
            searchParams: Record<string, string>
        ) => Promise<Response>;
    }
}

export interface Product {
    name: string;
    code: string;
}

export interface OrderProduct {
    source: string;
    sourceId: string;
    product: Product;
    count: number;
}

export type OrderProductsMap = {
    [key: string]: OrderProduct;
};

export interface SearchResultItem {
    code: string;
    name: string;
    price: number;
    sellingMethod: { code: string };
    unitDescription: string;
    brandName: string;
    secondLevelCategory: string;
}

export interface SearchApiResponse {
    results?: SearchResultItem[];
}
