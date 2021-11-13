export default class Weather {
    getFilteredTimestamps(data) {
        let futureDateTimes = this.getFutureDateTimes();

        return data.forecastTimestamps.filter(x => futureDateTimes.includes(x.forecastTimeUtc));
    }

    getFutureDateTimes() {
        let dateTimes = [];

        for (let i = 0; i < 12; i++) {
            let addedHours = new Date().addHours(i);
            let futureDate = addedHours.toLocaleDateString('en-CA');
            let futureTime = addedHours.toLocaleTimeString().slice(0, 2) + ':00:00';

            dateTimes.push(`${futureDate} ${futureTime}`)
        }

        return dateTimes;
    }
}