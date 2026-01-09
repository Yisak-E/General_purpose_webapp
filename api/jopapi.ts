export const options = (...params: any[]) => {
    return {
        method: params[0],
        url: params[1],
        params:{
            query: params[2].query || 'developer jobs in Chicago',
            page : params[2].page || '1',
            num_pages: params[2].num_pages || '1',
            country: params[2].country || 'us',
            date_posted: params[2].date_posted || 'all',
        },
        headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_JOPAPI_API_KEY || '',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };
}