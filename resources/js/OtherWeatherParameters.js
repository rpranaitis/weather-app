export default class OtherWeatherParameters {
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

        element.textContent = data[0].windSpeed + ' m/s';
    }

    updateWindDirection(data) {
        let degrees = document.querySelector('.wind-direction .body p');
        let icon = document.querySelector('.wind-direction .header .icon p');
        let possibleIconDegrees = [0, 23, 45, 68, 90, 113, 135, 158, 180, 203, 225, 248, 270, 293, 313, 336];
        let closestDegree = possibleIconDegrees.reduce((previous, current) => {
            return Math.abs(current - data[0].windDirection) < Math.abs(previous - data[0].windDirection) ? current : previous
        });

        degrees.textContent = data[0].windDirection + '°';
        icon.innerHTML = `<i class="wi wi-wind-direction"></i>`;
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
}