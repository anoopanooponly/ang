import * as moment from './../../../node_modules/moment-timezone/moment-timezone';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {

    getDateFormatted(day, month, year) {
    let date = year + "-" + month + "-" + day;
    //output== Feb 1, 2017 
    let stDate = moment(date, "YYYY-MM-DD").format("MMM DD, YYYY");
    return stDate;
  }

  getDayOfDate(date) {
      var dt = moment(date, "YYYY-MM-DD HH:mm:ss");
      return dt.format('dddd');
  }

  getDiffBetweenDates(startDate, endDate) {
        var dt = moment(endDate);
        return dt.diff(startDate, 'days');
  }

  getDaysBetween(noOfDays, startDay){
     let daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
     if(noOfDays <= 1){
         return [startDay];
     }
    
     if(noOfDays > 7) {
         return daysArr;
     }
     let idx =  daysArr.indexOf(startDay) + 1;
     let count = 1;
     let selectedArr = [];
     selectedArr.push(startDay);
      while(count < noOfDays) {
          
          selectedArr.push(daysArr[idx]);
          if(idx == daysArr.length - 1){
              idx = 0;
          } else {
               idx++;
               count++;
          }
          
         
      }
    return selectedArr;
  }

  getFormattedTime(date = null) {
        if(date == null)
        return moment().fromNow();
        else
         return moment(date).fromNow();
  }
}