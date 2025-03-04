async function fetchJson(url) {
    const response = await fetch(url)
    const obj = await response.json()
    return obj
}

async function getDashboardData(query) {
    try {
        const destinationsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${query}`)
        const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`)
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`)

        const promises = [destinationsPromise, weathersPromise, airportsPromise]
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises)

        const data = {}

        if (destinationsResult.status === "rejected") {
            console.error(`Errore in destinations: `, destinationsResult.reason)
            data.city = null
            data.country = null
        } else {
            const destination = destinationsResult.value[0]
            data.city = destination ? destination.name : null
            data.country = destination ? destination.country : null
        }

        if (weathersResult.status === "rejected") {
            console.error(`Errore in weathers: `, weathersResult.reason)
            data.temperature = null
            data.weather = null
        } else {
            const weather = weathersResult.value[0]
            data.temperature = weather ? weather.temperature : null
            data.weather = weather ? weather.weather_description : null
        }

        if (airportsResult.status === "rejected") {
            console.error(`Errore in airports: `, airportsResult.reason)
            data.airport = null
        } else {
            const airport = airportsResult.value[0]
            data.airport = airport ? airport.name : null
        }

        return data

    } catch (err) {
        throw new Error(`Errore nel recupero dei dati: ${err.message}`)
    }
}

getDashboardData('london')
    .then(data => {
        console.log('Dashboard data:', data);
        let phrase = ""
        if (data.city !== null && data.country !== null) {
            phrase += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature !== null && data.weather !== null) {
            phrase += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if (data.airport !== null) {
            phrase += `The main airport is ${data.airport}.\n`
        }
        console.log(phrase)
    })
    .catch(error => console.error(error));