"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var DateRangeValidatorService = (function () {
    function DateRangeValidatorService() {
    }
    DateRangeValidatorService.prototype.isDateRangeValid = function (daterange, dateFormat, minYear, maxYear, monthLabels) {
        var invalidDateRange = {
            beginDate: { day: 0, month: 0, year: 0 },
            endDate: { day: 0, month: 0, year: 0 }
        };
        var isMonthStr = dateFormat.indexOf("mmm") !== -1;
        if (daterange.length !== 23 && !isMonthStr || daterange.length !== 25 && isMonthStr) {
            return invalidDateRange;
        }
        var dates = daterange.split(" - ");
        if (dates.length !== 2) {
            return invalidDateRange;
        }
        var validDates = [];
        for (var i in dates) {
            var date = this.isDateValid(dates[i], dateFormat, minYear, maxYear, monthLabels, isMonthStr);
            if (date.day === 0 && date.month === 0 && date.year === 0) {
                return invalidDateRange;
            }
            validDates.push(date);
        }
        if (this.getTimeInMilliseconds(validDates[1]) < this.getTimeInMilliseconds(validDates[0])) {
            return invalidDateRange;
        }
        return {
            beginDate: { day: validDates[0].day, month: validDates[0].month, year: validDates[0].year },
            endDate: { day: validDates[1].day, month: validDates[1].month, year: validDates[1].year }
        };
    };
    DateRangeValidatorService.prototype.isMonthLabelValid = function (monthLabel, monthLabels) {
        for (var key = 1; key <= 12; key++) {
            if (monthLabel.toLowerCase() === monthLabels[key].toLowerCase()) {
                return key;
            }
        }
        return -1;
    };
    DateRangeValidatorService.prototype.isYearLabelValid = function (yearLabel, minYear, maxYear) {
        if (yearLabel >= minYear && yearLabel <= maxYear) {
            return yearLabel;
        }
        return -1;
    };
    DateRangeValidatorService.prototype.parseDatePartNumber = function (dateFormat, dateString, datePart) {
        var pos = dateFormat.indexOf(datePart);
        if (pos !== -1) {
            var value = dateString.substring(pos, pos + datePart.length);
            if (!/^\d+$/.test(value)) {
                return -1;
            }
            return parseInt(value);
        }
        return -1;
    };
    DateRangeValidatorService.prototype.parseDatePartMonthName = function (dateFormat, dateString, datePart, monthLabels) {
        var pos = dateFormat.indexOf(datePart);
        if (pos !== -1) {
            return this.isMonthLabelValid(dateString.substring(pos, pos + datePart.length), monthLabels);
        }
        return -1;
    };
    DateRangeValidatorService.prototype.parseDefaultMonth = function (monthString) {
        var month = { monthTxt: "", monthNbr: 0, year: 0 };
        if (monthString !== "") {
            var split = monthString.split(monthString.match(/[^0-9]/)[0]);
            month.monthNbr = split[0].length === 2 ? parseInt(split[0]) : parseInt(split[1]);
            month.year = split[0].length === 2 ? parseInt(split[1]) : parseInt(split[0]);
        }
        return month;
    };
    DateRangeValidatorService.prototype.isDateValid = function (date, dateFormat, minYear, maxYear, monthLabels, isMonthStr) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var invalidDate = { day: 0, month: 0, year: 0 };
        if (date.length !== 10 && !isMonthStr || date.length !== 11 && isMonthStr) {
            return invalidDate;
        }
        var separator = dateFormat.replace(/[dmy]/g, "")[0];
        var parts = date.split(separator);
        if (parts.length !== 3) {
            return invalidDate;
        }
        var day = this.parseDatePartNumber(dateFormat, date, "dd");
        var month = isMonthStr ? this.parseDatePartMonthName(dateFormat, date, "mmm", monthLabels) : this.parseDatePartNumber(dateFormat, date, "mm");
        var year = this.parseDatePartNumber(dateFormat, date, "yyyy");
        if (day !== -1 && month !== -1 && year !== -1) {
            if (year < minYear || year > maxYear || month < 1 || month > 12) {
                return invalidDate;
            }
            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                daysInMonth[1] = 29;
            }
            if (day < 1 || day > daysInMonth[month - 1]) {
                return invalidDate;
            }
            return { day: day, month: month, year: year };
        }
        return invalidDate;
    };
    DateRangeValidatorService.prototype.getTimeInMilliseconds = function (date) {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime();
    };
    return DateRangeValidatorService;
}());
DateRangeValidatorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DateRangeValidatorService);
exports.DateRangeValidatorService = DateRangeValidatorService;
