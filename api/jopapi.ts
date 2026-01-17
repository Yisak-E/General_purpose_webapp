type JobSearchParams = {
    query?: string;
    page?: string | number;
    num_pages?: string | number;
    country?: string;
    date_posted?: string;
};

export const options = (
    method: string,
    url: string,
    params: JobSearchParams = {}
) => {
    return {
        method,
        url,
        params: {
            query: params.query ?? "developer jobs in Chicago",
            page: String(params.page ?? "1"),
            num_pages: String(params.num_pages ?? "1"),
            country: params.country ?? "us",
            date_posted: params.date_posted ?? "all",
        },
        headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_JOPAPI_API_KEY || "",
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
    };
};