import 'dotenv/config';

const API_KEY = process.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.VITE_TMDB_ACCESS_TOKEN;

async function testTMDB() {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    };

    try {
        const response = await fetch(url, options);
        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                console.log('First movie title:', data.results[0].title);
                console.log('First movie overview:', data.results[0].overview);
            } else {
                console.log('No results found.');
            }
        } else {
            console.log('Error:', response.statusText);
        }

    } catch (err) {
        console.error('error:' + err);
    }
}

testTMDB();
