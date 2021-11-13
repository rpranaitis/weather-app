import Weather from "./Weather";

export default class Temperature extends Weather {
    conditionIcons = {
        'clear':            '<i class="wi wi-day-sunny"></i>',
        'isolated-clouds':  '<i class="wi wi-day-cloudy"></i>',
        'scattered-clouds': '<i class="wi wi-day-sunny-overcast"></i>',
        'overcast':         '<i class="wi wi-cloudy"></i>',
        'light-rain':       '<i class="wi wi-rain-mix"></i>',
        'moderate-rain':    '<i class="wi wi-hail"></i>',
        'heavy-rain':       '<i class="wi wi-rain"></i>',
        'sleet':            '<i class="wi wi-sprinkle"></i>',
        'light-snow':       '<i class="wi wi-sleet"></i>',
        'moderate-snow':    '<i class="wi wi-snow"></i>',
        'heavy-snow':       '<i class="wi wi-snow-wind"></i>',
        'fog':              '<i class="wi wi-fog"></i>',
        'na':               '<i class="wi wi-na"></i>'
    }

    updateTemperatureBlock(data) {
        let filteredTimestamps = this.getFilteredTimestamps(data);

        this.updateTimes(filteredTimestamps);
        this.updateIcons(filteredTimestamps);
        this.updateTemperatures(filteredTimestamps);
    }

    updateTimes(filteredTimestamps) {
        let tempTimes = document.querySelectorAll('.temp-blocks .time p')

        for (let i = 0; i < tempTimes.length; i++) {
            let tempTime = tempTimes[i];

            if (i === 0) {
                tempTime.textContent = 'Dabar';
            } else {
                let dateTime = filteredTimestamps[i].forecastTimeUtc;

                tempTime.textContent = this.exctractTime(dateTime);
            }
        }
    }

    updateIcons(filteredTimestamps) {
        let tempIcons = document.querySelectorAll('.temp-blocks .icon p')

        for (let i = 0; i < tempIcons.length; i++) {
            let temIcon = tempIcons[i];
            let condition = filteredTimestamps[i].conditionCode;

            temIcon.innerHTML = this.conditionIcons[condition];
        }
    }

    updateTemperatures(filteredTimestamps) {
        let tempTemperatures = document.querySelectorAll('.temp-blocks .temperature p')

        for (let i = 0; i < tempTemperatures.length; i++) {
            let tempTemperature = tempTemperatures[i];

            tempTemperature.textContent = filteredTimestamps[i].airTemperature + '°';
        }
    }

    exctractTime(input) {
        return input.substr(11, 5);
    }

    get conditionIcons() {
        return this.conditionIcons;
    }
}