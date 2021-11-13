export default class Weather {
    getSkipAmount(datetime) {
        let creationHours = this.exctractHours(datetime);
        let currentHours = new Date().getHours();

        return currentHours - creationHours;
    }

    exctractHours(input) {
        return input.substr(11, 2);
    }
}