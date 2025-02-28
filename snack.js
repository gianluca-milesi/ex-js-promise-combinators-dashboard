async function fetchJson(url) {
    const response = await fetch(url)
    const obj = await response.json()
    return obj
}

async function getDashboardData(query) {
    try {
        const [promise1, promise2, promise3] = await Promise.all([
            fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${query}`),
            fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`),
            fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`)
        ])

        const destination = promise1[0] || {}
        const weather = promise2[0] || {}
        const airport = promise3[0] || {}

        return {
            city: destination.name,
            country: destination.country,
            temperature: weather.temperature,
            weather: weather.weather_description,
            airport: airport.name
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

getDashboardData('london')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error));