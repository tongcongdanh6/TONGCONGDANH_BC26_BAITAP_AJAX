import { Error } from '../models/Error.js';
import { removeVietnameseTones } from '../modules/ultils.js';

const CANNOT_EMPTY = 'không được rỗng';
const MUST_BE_NUMERIC = 'phải là số';
const CANNOT_LESS_THAN_LENGTH = (number) => `không được nhỏ hơn ${number} ký tự`;
const CANNOT_GREATER_THAN_LENGTH = (number) => `không được lớn hơn ${number} ký tự`;
const MUST_BE_GREATER_THAN_OR_EQUAL = (number) => `phải lớn hơn hoặc bằng ${number}`;
const MUST_BE_LESS_THAN_OR_EQUAL = (number) => `phải nhỏ hơn hoặc bằng ${number}`;
const MUST_BE_ALPHABET = 'phải là ký tự';

export class Validation {
    // #PRIVATE attribute
    #dataRules = [];
    #dataValueUserInput = {};
    
    constructor(__dataRules, __dataUserInput) {
        this.#dataRules = __dataRules;
        this.#dataValueUserInput = __dataUserInput;
    }

    // PUBLIC Method
    formValidate = () => {
        let errors = [];
        for(let objInput of this.#dataRules) {
            // Lấy chuỗi rules của 1 object
            let { name, rules, display } = objInput;

            let arrRules = rules.split('|');

            for(let rules of arrRules) {
                let valueUserInput = this.#dataValueUserInput[name];
                switch(rules) {
                    case 'empty' :
                        if(this.#checkEmpty(valueUserInput)) {
                            errors.push(new Error(`#${name}_errors`, display, CANNOT_EMPTY));
                        }
                        break;
                    case 'all_numeric' :
                        if(!this.#checkAllNumeric(valueUserInput)) {
                            errors.push(new Error(`#${name}_errors`, display, MUST_BE_NUMERIC));                            
                        }
                        break;
                    case 'all_alphabet' :
                        if(!this.#checkAllAlphabet(valueUserInput)) {
                            errors.push(new Error(`#${name}_errors`, display, MUST_BE_ALPHABET));     
                        }
                        break;
                    case rules.match(/min_length/)?.input :
                        // Lấy số ký tự tối thiểu cho phép
                        let minLengthRequired = +rules.match(/\d+/)[0];
                        if(this.#checkLessThanMinLength(valueUserInput, minLengthRequired)) {
                            errors.push(new Error(`#${name}_errors`, display, CANNOT_LESS_THAN_LENGTH(minLengthRequired)));    
                        }
                        break;
                    case rules.match(/max_length/)?.input :
                        // Lấy số ký tự tối đa cho phép
                        let maxLengthRequired = +rules.match(/\d+/)[0];
                        if(this.#checkGreaterThanMaxLength(valueUserInput, maxLengthRequired)) {
                            errors.push(new Error(`#${name}_errors`, display, CANNOT_GREATER_THAN_LENGTH(maxLengthRequired)));    
                        }
                        break;
                    case rules.match(/must_greater_than_or_equal/)?.input :
                        let minRequired = +rules.match(/\d+/)[0];
                        if(!this.#checkGreaterThanOrEqual(valueUserInput, minRequired)) {
                            errors.push(new Error(`#${name}_errors`, display, MUST_BE_GREATER_THAN_OR_EQUAL(minRequired)));
                        }
                        break;
                    case rules.match(/must_less_than_or_equal/)?.input :
                        let maxRequired = +rules.match(/\d+/)[0];
                        if(!this.#checkLessThanOrEqual(valueUserInput, maxRequired)) {
                            errors.push(new Error(`#${name}_errors`, display, MUST_BE_LESS_THAN_OR_EQUAL(maxRequired)));
                        }
                        break;
                }
            }
        }
        console.log(errors);
        return errors;
    }

    // #PRIVATE methods
    #checkEmpty(value) {
        return value === '';
    }

    #checkAllNumeric(value) {
        let numericRegex = /^\-?[0-9]+$/;
        return numericRegex.test(value);
    }

    #checkLessThanMinLength(value, requireMinLength) {
        return value.length < requireMinLength;
    }

    #checkGreaterThanMaxLength(value, requireMaxLength) {
        return value.length > requireMaxLength;
    }

    #checkAllAlphabet(value) {
        // Xóa hết dấu của tiếng Việt
        let str = removeVietnameseTones(value).toLowerCase();
        let alphabetRegex = /^[a-z ]+$/i;
        return alphabetRegex.test(str);
    }

    #checkGreaterThanOrEqual(value, requiredMinValue) {
        return value >= requiredMinValue;
    }

    #checkLessThanOrEqual(value, requiredMaxValue) {
        return value <= requiredMaxValue;
    }  
}