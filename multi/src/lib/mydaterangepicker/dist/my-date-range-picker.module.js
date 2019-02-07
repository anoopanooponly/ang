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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var my_date_range_picker_component_1 = require("./my-date-range-picker.component");
var my_date_range_picker_input_directive_1 = require("./directives/my-date-range-picker.input.directive");
var MyDateRangePickerModule = (function () {
    function MyDateRangePickerModule() {
    }
    return MyDateRangePickerModule;
}());
MyDateRangePickerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [my_date_range_picker_component_1.MyDateRangePicker, my_date_range_picker_input_directive_1.InputFocusDirective],
        exports: [my_date_range_picker_component_1.MyDateRangePicker, my_date_range_picker_input_directive_1.InputFocusDirective]
    }),
    __metadata("design:paramtypes", [])
], MyDateRangePickerModule);
exports.MyDateRangePickerModule = MyDateRangePickerModule;
