const Categories = require("./Categories");

const DataValidator = {
    isDateTimeStringValid: (dateTimeStr) => {
        const regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
        if (dateTimeStr.match(regex) === null) {
            return false;
        }
        const now = new Date();
        const date = new Date(dateTimeStr);
        
        if (isNaN(date)) {
            return false;
        }
    
        if (date < now) {
            return false;
        }
    
        return true;
    },
    isCatogoryIdValid: (categoryId) => {
        return categoryId && Categories[categoryId] !== undefined;
    },
}

module.exports = DataValidator;