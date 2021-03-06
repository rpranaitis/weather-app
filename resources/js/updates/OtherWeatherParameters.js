export default class OtherWeatherParameters {
    windDirectionTranslator = {
        'N':    'Š',
        'NNE':  'ŠŠR',
        'NE':   'ŠR',
        'ENE':  'RŠR',
        'E':    'R',
        'ESE':  'RPR',
        'SE':   'PR',
        'SSE':  'PPR',
        'S':    'P',
        'SSW':  'PPV',
        'SW':   'PV',
        'WSW':  'VPV',
        'W':    'V',
        'WNW':  'VŠV',
        'NW':   'ŠV',
        'NNW':  'ŠŠV'
    }

    updateAllParameters(data) {
        this.updateWindSpeed(data);
        this.updateWindDirection(data);
        this.updateCloudCover(data);
        this.updatePressure(data);
        this.updateHumidity(data);
        this.updatePrecipitation(data);
    }

    updateWindSpeed(data) {
        let element = document.querySelector('.wind-speed .body p');
        element.classList.remove('text-danger');

        if (data[0].windSpeed > 10) {
            element.classList.add('text-danger');
        }

        element.textContent = data[0].windSpeed + ' m/s';
    }

    updateWindDirection(data) {
        let degrees = document.querySelector('.wind-direction .body p');
        let icon = document.querySelector('.wind-direction .header .icon p');
        let possibleIconDegrees = [0, 23, 45, 68, 90, 113, 135, 158, 180, 203, 225, 248, 270, 293, 313, 336];
        let closestDegree = possibleIconDegrees.reduce((previous, current) => {
            return Math.abs(current - data[0].windDirection) < Math.abs(previous - data[0].windDirection) ? current : previous
        });

        let compass = this.degToCompass(data[0].windDirection);

        degrees.textContent = this.windDirectionTranslator[compass];
        icon.innerHTML = `<i class="wi wi-wind towards-${closestDegree}-deg"></i>`;
    }

    updateCloudCover(data) {
        let element = document.querySelector('.cloud-cover .body p');

        element.textContent = data[0].cloudCover + '%';
    }

    updatePressure(data) {
        let element = document.querySelector('.pressure .body p');

        element.textContent = data[0].seaLevelPressure + ' hPa';
    }

    updateHumidity(data) {
        let element = document.querySelector('.humidity .body p');

        element.textContent = data[0].relativeHumidity + '%';
    }

    updatePrecipitation(data) {
        let element = document.querySelector('.precipitation .body p');

        element.textContent = data[0].totalPrecipitation + ' mm';
    }

    degToCompass(value) {
        let rounded = Math.floor((value / 22.5) + 0.5);
        let directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

        return directions[(rounded % 16)];
    }

    get windDirectionTranslator() {
        return this.windDirectionTranslator;
    }
}