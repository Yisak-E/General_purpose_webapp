// This file is no longer needed with the refactored approach in JopSearch.jsx
// since the API call and options are now defined directly in the component.

// Keeping the original file content for reference.

/*
  params: {
    query: 'developer jobs in chicago',
    page: '1',
    num_pages: '1',
    country: 'us',
    date_posted: 'all'
  },
* */

export const options =(...params) => (
    {

  method: params[0],
  url: params[1],
  params: {
    query: params[2].query || 'developer jobs in chicago',
    page: params[2].page || '1',
    num_pages: params[2].num_pages || '1',
    country: params[2].country || 'us',
    date_posted: params[2].date_posted || 'all'
  },
  headers: {
    'x-rapidapi-key': 'c8b4f4187fmsh7b80bfb6f31dee5p195f83jsn34b238ea4898',
    'x-rapidapi-host': 'jsearch.p.rapidapi.com'
  }
});
