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
        let element = document.querySelector('.wind-direction .body p');

        element.textContent = data[0].windDirection + ' °';
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