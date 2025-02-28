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
            city: destination.name || null,
            country: destination.country || null,
            temperature: weather.temperature || null,
            weather: weather.weather_description || null,
            airport: airport.name || null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

getDashboardData("vienna")
    .then(data => {
        console.log("Dashboard data:", data)
        let output = `${data.city} is in ${data.country}.\n`
        if (data.temperature !== null && data.weather !== null) {
            output += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if (data.airport !== "Unknown") {
            output += `The main airport is ${data.airport}.\n`
        }
        console.log(output)
    })
    .catch(error => console.error(error))