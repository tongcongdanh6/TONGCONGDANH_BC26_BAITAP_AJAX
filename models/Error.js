export class Error {
    constructor(__errorSelector, __elementLabel, __message) {
        this.errorSelector = __errorSelector;
        this.elementLabel = __elementLabel;
        this.message = __message;
    }
}