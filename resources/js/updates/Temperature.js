export default class Temperature {
    conditionDayIcons = {
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

    conditionNightIcons = {
        'clear':            '<i class="wi wi-night-clear"></i>',
        'isolated-clouds':  '<i class="wi wi-night-alt-cloudy"></i>',
        'scattered-clouds': '<i class="wi wi-night-alt-partly-cloudy"></i>',
        'overcast':         '<i class="wi wi-night-cloudy"></i>',
        'light-rain':       '<i class="wi wi-night-rain-mix"></i>',
        'moderate-rain':    '<i class="wi wi-night-hail"></i>',
        'heavy-rain':       '<i class="wi wi-night-rain"></i>',
        'sleet':            '<i class="wi wi-night-sprinkle"></i>',
        'light-snow':       '<i class="wi wi-night-sleet"></i>',
        'moderate-snow':    '<i class="wi wi-night-snow"></i>',
        'heavy-snow':       '<i class="wi wi-night-snow-wind"></i>',
        'fog':              '<i class="wi wi-night-fog"></i>',
        'na':               '<i class="wi wi-na"></i>'
    }

    conditionTranslator = {
        'clear':            'Giedra',
        'isolated-clouds':  'Mažai debesuota',
        'scattered-clouds': 'Debesuota su pragiedruliais',
        'overcast':         'Debesuota',
        'light-rain':       'Nedidelis lietus',
        'moderate-rain':    'Lietus',
        'heavy-rain':       'Smarkus lietus',
        'sleet':            'Šlapdriba',
        'light-snow':       'Nedidelis sniegas',
        'moderate-snow':    'Sniegas',
        'heavy-snow':       'Smarkus sniegas',
        'fog':              'Rūkas',
        'na':               'Rro sąlygos nenustatyto'
    }

    updateTemperatureBlock(data) {
        this.updateTimes(data);
        this.updateIcons(data);
        this.updateTemperatures(data);
    }

    updateTimes(data) {
        let tempTimes = document.querySelectorAll('.temp-blocks .time p')

        for (let i = 0; i < tempTimes.length; i++) {
            let tempTime = tempTimes[i];

            if (i === 0) {
                tempTime.textContent = 'Dabar';
            } else {
                let dateTime = data[i].forecastTimeUtc;

                tempTime.textContent = this.exctractTime(dateTime);
            }
        }
    }

    updateIcons(data) {
        let tempIcons = document.querySelectorAll('.temp-blocks .icon p')

        for (let i = 0; i < tempIcons.length; i++) {
            let temIcon = tempIcons[i];
            let condition = data[i].conditionCode;

            temIcon.setAttribute('title', this.conditionTranslator[condition]);
            temIcon.innerHTML = this.isDayNow() ? this.conditionDayIcons[condition] : this.conditionNightIcons[condition];
        }
    }

    updateTemperatures(data) {
        let tempTemperatures = document.querySelectorAll('.temp-blocks .temperature p')

        for (let i = 0; i < tempTemperatures.length; i++) {
            let tempTemperature = tempTemperatures[i];

            tempTemperature.textContent = data[i].airTemperature.toFixed() + '°';
        }
    }

    isDayNow() {
        let nightHours = [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7];

        return !nightHours.includes(new Date().getHours());
    }

    exctractTime(input) {
        return input.substr(11, 5);
    }

    get conditionDayIcons() {
        return this.conditionDayIcons;
    }

    get conditionNightIcons() {
        return this.conditionNightIcons;
    }

    get conditionTranslator() {
        return this.conditionTranslator;
    }
}