import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  date!: Date;
  currentDate!: string;
  selected!: string;
  showDay!: boolean;
  showWeek!: boolean;
  showMonth!: boolean;
  currentWeek!: Array<string>;
  currentMonth!: Array<string>;
  schedule!: Array<any>;
  openPopup!: boolean;
  precision!: boolean;
  name!: string;
  address!: string;
  start!: string;
  end!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.precision = false;
    // if (token == null) {
    //   this.router.navigate(['/login']);
    //   return;
    // }
    // if (localStorage.getItem('test') == "1") {
    //   this.router.navigate(['/login']);
    //   return;
    // }
    // if (localStorage.getItem('test') == "2") {
    //   localStorage.setItem('test', "1");
    // }
    // if (localStorage.getItem('test') == "3") {
    //   localStorage.setItem('test', "2");
    // }
    // jwt.verify(token, 'secret', (err: any, decoded: any) => {
    //   if (err) {
    //     this.router.navigate(['/login']);
    //   }
    // }),

    this.date = new Date();
    this.showDay = true;
    this.currentDate = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
    //you can selected the day, week, month
    this.selected = 'day';
    let beginDate = this.date
    beginDate.setHours(0, 0, 0, 0);
    let begin = beginDate.toISOString();
    let endDate = this.date
    endDate.setHours(23, 59, 59, 999);
    let end = endDate.toISOString();
    this.getSchedules(this.date, begin, end, []);
    this.openPopup = false;
  }

  newEvent() {
    this.openPopup = !this.openPopup;
  }
  prevDate() {
    if (this.selected == 'day') {
      this.date.setDate(this.date.getDate() - 1);
      this.currentDate = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
      let beginDate = this.date
      beginDate.setHours(0, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.getSchedules(this.date, begin, end, []);
    } else if (this.selected == 'week') {
      this.date.setDate(this.date.getDate() - 7);
      let arr = this.getWeek(this.date)
      let beginDate = this.date
      beginDate.setHours(0, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.getSchedules(this.date, begin, end, arr);
    } else {
      this.date.setMonth(this.date.getMonth() - 1);
      let arr = this.getMonth(this.date)
      let beginDate = this.date
      beginDate.setHours(0, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.getSchedules(this.date, begin, end, arr);
    }
  }

  nextDate() {
    if (this.selected == 'day') {
      this.date.setDate(this.date.getDate() + 1);
      let beginDate = this.date
      beginDate.setHours(1, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.currentDate = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
      this.getSchedules(this.date, begin, end, []);
    } else if (this.selected == 'week') {
      this.date.setDate(this.date.getDate() + 7);
      let arr = this.getWeek(this.date)
      let beginDate = this.date
      beginDate.setHours(0, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.getSchedules(this.date, begin, end, arr);
    } else {
      this.date.setMonth(this.date.getMonth() + 1);
      let arr = this.getMonth(this.date)
      let beginDate = this.date
      beginDate.setHours(0, 0, 0, 0);
      let begin = beginDate.toISOString();
      let endDate = this.date
      endDate.setHours(23, 59, 59, 999);
      let end = endDate.toISOString();
      this.getSchedules(this.date, begin, end, arr);
    }
  }

  async getSchedules(date: Date, begin: string, end: string, arr: Array<any>) {
    // let id = localStorage.getItem('id');
    let id = 31
    let link = "http://localhost:3000/user/" + id + "/schedule/?begin=" + begin + "&end=" + end
    let token = localStorage.getItem('token');
    const response = await fetch(link,
    {
      method: "GET",
      mode: "cors",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
          },
    });
    response.json().then(data => {
        this.schedule = data
        for (let i = 0; i < this.schedule.length; i++) {
          if (this.selected == 'day') {
            let begin = this.schedule[i].begin
            let end = this.schedule[i].end
            let beginHour = begin.slice(11, 13)
            let beginMinute = begin.slice(14, 16)
            let endHour = end.slice(11, 13)
            let endMinute = end.slice(14, 16)
            let beginTime = parseInt(beginHour) + parseInt(beginMinute) / 60
            let endTime = parseInt(endHour) + parseInt(endMinute) / 60
            let top = 50 + 85 * (beginTime - 9)
            let height = 80 * (endTime - beginTime)
            this.schedule[i].height = height - 22
            this.schedule[i].top = top
            this.schedule[i].beginH = beginHour
            this.schedule[i].beginM = beginMinute
            this.schedule[i].endH = endHour
            this.schedule[i].endM = endMinute
          } else if (this.selected == 'week') {
            console.log(this.schedule[i])
            let begin = this.schedule[i].begin
            let end = this.schedule[i].end
            let tmp = new Date(begin)
            let startDate = tmp.toString().slice(0, 10)
            for (let j = 0; j < arr.length; j++) {
              let tmp = arr[j].toString().slice(0, 10)
              if (startDate == tmp) {
                this.schedule[i].left = j * 23 + '%'
                break
              }
            }
            let beginHour = begin.slice(11, 13)
            let beginMinute = begin.slice(14, 16)
            let endHour = end.slice(11, 13)
            let endMinute = end.slice(14, 16)
            let beginTime = parseInt(beginHour) + parseInt(beginMinute) / 60
            let endTime = parseInt(endHour) + parseInt(endMinute) / 60
            console.log(beginTime, endTime)
            let top = 58 + 85 * (beginTime - 9)
            let height = 75 * (endTime - beginTime)
            this.schedule[i].height = height - 22
            this.schedule[i].top = top
            this.schedule[i].beginH = beginHour
            this.schedule[i].beginM = beginMinute
            this.schedule[i].endH = endHour
            this.schedule[i].endM = endMinute
          }
          else if (this.selected == 'month') {
            let begin = this.schedule[i].begin
            let day = begin.slice(8, 10)
            console.log(day)
            let top = 0
            if (day <= 7) {
              top = 25    
            } else if (day <= 14) {
              top = 125
            } else if (day <= 21) {
              top = 225
            } else if (day <= 28){
              top = 325
            } else {
              top = 425
            }
            console.log(top)
            this.schedule[i].top = top
            let dayNum = parseInt(day)
            let left = 23 + "%"
            if (dayNum - 7 <= 0) {
              left = 1 + 8 * (dayNum) + '%'
            } else if (dayNum - 14 <= 0) {
              left = 1 * (dayNum - 7) + '%'
            } else if (dayNum - 21 <= 0) {
              left = 1 * (dayNum - 14) + '%'
            } else if (dayNum - 28 <= 0) {
              left = 1 * (dayNum - 21) + '%'
            } else {
              left = 1 * (dayNum - 28) + '%'
            }
            console.log(left)
            this.schedule[i].left = left
          }
        }
    })
  }

  selectDay() {
    this.date = new Date();
    this.currentDate = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
    this.showDay = true;
    this.showWeek = false;
    this.showMonth = false;
    this.selected = 'day';
    let beginDate = this.date
    beginDate.setHours(0, 0, 0, 0);
    let begin = beginDate.toISOString();
    let endDate = this.date
    endDate.setHours(23, 59, 59, 999);
    let end = endDate.toISOString();
    this.getSchedules(this.date, begin, end, []);
  }

  selectWeek() {
    this.showDay = false;
    this.showWeek = true;
    this.showMonth = false;
    this.selected = 'week';
    var curr = new Date; // get current date
    this.date = curr;
    let arr = this.getWeek(curr)
    let beginDate = arr[0]
    beginDate.setHours(0, 0, 0, 0);
    let begin = beginDate.toISOString();
    let endDate = arr[arr.length - 1]
    endDate.setHours(23, 59, 59, 999);
    let end = endDate.toISOString();
    this.getSchedules(this.date, begin, end, arr);
  }
  
  selectMonth() {
    this.showDay = false;
    this.showWeek = false;
    this.showMonth = true;
    this.selected = 'month';
    var curr = new Date; // get current date
    this.date = curr;
    let arr = this.getMonth(curr)
    let beginDate = arr[0]
    beginDate.setHours(0, 0, 0, 0);
    let begin = beginDate.toISOString();
    let endDate = arr[arr.length - 1]
    endDate.setHours(23, 59, 59, 999);
    let end = endDate.toISOString();
    this.getSchedules(this.date, begin, end, arr);
  }
  
  getWeek(today: Date) {
    const dayOfWeek = today.getDay();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (dayOfWeek - 1));
    const datesOfWeek = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      datesOfWeek.push(date);
    }
    this.currentWeek = datesOfWeek.map(date => date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    this.currentDate = datesOfWeek[0].getDate() + '/' + (datesOfWeek[0].getMonth() + 1) + '/' + datesOfWeek[0].getFullYear() + ' - ' + datesOfWeek[6].getDate() + '/' + (datesOfWeek[6].getMonth() + 1) + '/' + datesOfWeek[6].getFullYear();
    return datesOfWeek;
  }

  getMonth(today: Date) {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const datesOfMonth = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      datesOfMonth.push(date);
    }

    this.currentMonth = datesOfMonth.map(date => date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    console.log("currentMonth", this.currentMonth)
    const monthArray = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout','Septembre', 'Octobre', 'Novembre', 'Décembre']
    var index = datesOfMonth[10].getMonth() + 1;
    var yeard = datesOfMonth[10].getFullYear();
    if (index == 12) {
      index = 0
      yeard = yeard + 1
    }
    this.currentDate = monthArray[index] + ' ' + yeard;
    return datesOfMonth;
  }
  goCarte() {
    let date = this.currentDate
    this.router.navigate(['/carte', date]);
  }

  changeSelect() {
    this.precision = !this.precision;
    if (this.precision) {
      
    }
  }
  onEnterName(value: string) {
    this.name = value;
    console.log(this.name, value)
  }
  onEnterAdd(value: string) {
    this.address = value;
  }
  onEnterStart(value: string) {
    this.start = value;
    console.log(this.start)
  }
  onEnterEnd(value: string) {
    this.end = value;
  }
  dateIsValid(date: Date) {
    return !Number.isNaN(new Date(date).getTime());
  }
  async addEvent() {
    let id = 31
    let link = "http://localhost:3000/user/" + id + "/schedule"
    let startDate = new Date(this.start)
    let endDate = new Date(this.end)
    if (this.precision) {
        let startHour = startDate.getHours()
        let endHour = endDate.getHours()
        if (startHour > endHour) {
            alert("L'heure de depart doit etre inferieur a l'heure de fin")
            return
        }
        if (startHour < 9 || startHour > 17) {
            alert("L'heure de depart doit etre comprise entre 9h et 17h")
            return
        }
        startDate.setHours(startDate.getHours() + 2)
        endDate.setHours(endDate.getHours() + 2)
    } else {
        startDate.setHours(9)
        endDate.setHours(17)
    }
    if (this.dateIsValid(startDate) == false || this.dateIsValid(endDate) == false) {
        alert("Rentrez des dates valides")
        return
    }
    console.log(startDate, endDate)
    let startDateS = startDate.toISOString()
    let endDateS = endDate.toISOString()
    
    fetch(link, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Valorant-35"
            // "Authorization": "Bearer " + localStorage.getItem('token')
        },
        body: JSON.stringify({
            name: this.name,
            begin: startDateS,
            end: endDateS,
            address: this.address
        }),
    }) .then(data => {
        console.log(data)
        this.openPopup = false;
        // this.name = ''
        // this.start = ''
        // this.end = ''
        this.updateitinary(this.name, startDateS, endDateS, this.address)
    }) .catch(err => {
        console.log("Error:", err)
    })
  }
  updateitinary(name: string, start: string, end: string, address: string) {
    let link = "http://localhost:3000/user/31/avalaibleSlots/?name=" + name + "&begin=" + start + "&end=" + end + "&address=" + address + "&returnTostart=false&itinaryDay" + start
    fetch(link, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer Valorant-35"
      }}).then(data => {
        console.log(data)
      })

  }
}
