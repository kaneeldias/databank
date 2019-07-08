import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas"
    , "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands"
    , "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica"
    , "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea"
    , "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana"
    , "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India"
    , "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia"
    , "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania"
    , "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia"
    , "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal"
    , "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles"
    , "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan"
    , "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia"
    , "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay"
    , "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];


  public asian_countries = ['India','Indonesia','Pakistan','Bangladesh','Japan','Philippines','Vietnam','Iran','Turkey','Thailand','Burma','South Korea','Iraq','Uzbekistan','Saudi Arabia','Malaysia','Afghanistan','Nepal','Yemen','North Korea','Sri Lanka','Kazakhstan','Syria','Cambodia','Jordan','Azerbaijan','United Arab Emirates','Israel','Tajikistan','Laos','Lebanon','Kyrgyzstan','Turkmenistan','Singapore','Palestine','Oman','Kuwait','Georgia','Mongolia','Armenia','Qatar','Bahrain','Timor-Leste','Cyprus','Bhutan','Brunei','Maldives']

  public s_asian_countries = ['Afghanistan','Bangladesh','Bhutan','India','Maldives','Nepal','Pakistan','Sri Lanka']


  public compare_countries = ["India", "Pakistan", "Singapore"];

  public metrics = [
    { name: "Population", value: "population", file: "population.csv", units:"", icon:"baby.png"},
    { name: "Infant Mortality", value: "infant_mortality", file: "infant_mortality.csv", units:" per 1000 births", icon:"baby.png"},
    { name: "Suicide Mortality", value: "suicide_mortality", file: "suicide_mortality.csv", units:" per 1000 births", icon:"baby.png"},
    { name: "Literacy", value: "Literacy", file: "literacy.csv", units: "%" }
  ];

  public compare;

  public years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];

  public data;

  public selected_country;
  public start = 2000;
  public end = 2018;

  public selected_metric;
  public loaded = false;

  public gen = {
    metric: "",
    start: 0,
    end: 0,
    compare: ""
  }

  public info = {
    sl_avg: 0,
    cp_avg: 0
  }

  public chartData: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [
      ['Year', 'SL', 'Other']
    ],
    options: {
      width: 1200,
      height: 500,
      series: {
        0: { color: '#3a539b', targetAxisIndex: 0 },
        1: { color: '#abb7b7', targetAxisIndex: 0 },
      },
      chartArea: {
        width: '100%',
        left: 70
      },
      legend: 'top',
      hAxis: {
        format: "0000",
        groupByRowLabel: true,
        gridlines: {
          count: -1
        }
      },
      vAxes: {
        // Adds titles to each axis.

      },
      lineWidth: 3,
      pointSize: 7,
      animation: {
        duration: 2000,
        easing: "out",
        startup: true
      }
    },
  };


  constructor(public http: HttpClient, public papa: Papa) { }

  ngOnInit() {
    this.selected_metric = this.metrics[0];
    this.compare = "World";
   }

  loadFile() {
    this.loaded = false;
    let self = this;
    console.log(this.selected_metric);
    let file = this.selected_metric.file;
    this.http.get("../assets/files/" + file, { responseType: 'text' }).toPromise().then(function (data) {
      self.papa.parse(data, {
        complete: (result) => {
          console.log(result);
          let headers = result.data[0];
          let x = {};
          for (var i = 1; i < result.data.length; i++) {
            let y = {};
            for (var j = 1; j < headers.length; j++) {
              y[headers[j]] = parseFloat(result.data[i][j]);
            }
            x[result.data[i][0]] = y;
          }
          self.data = x;
          self.fuckAll();
        }
      });
    });


  }

  submit() {
    this.loadFile();
  }

  fuckAll() {
    this.gen.metric = this.selected_metric;
    this.gen.compare = this.compare;
    if (this.compare == "Country") {
      this.gen.compare = this.selected_country;
    }
    this.gen.start = this.start;
    this.gen.end = this.end;
    if (this.compare == "Country") {
      this.compare_countries = [];
      this.compare_countries.push(this.selected_country);
    }
    if(this.compare == "World"){
      this.compare_countries = this.countries;
    }

    if(this.compare == "Asia"){
      this.compare_countries = this.asian_countries;

    }

    if(this.compare == "South Asia"){
      this.compare_countries = this.s_asian_countries;

    }

    this.calc();
  }


  calc() {
    let self = this;
    let sl_i = this.data['Sri Lanka'];
    let sl = {};
    for (var key in sl_i) {
      if (!isNaN(sl_i[key])) sl[key] = sl_i[key];
    }
    let sum = {};
    let counts = {};
    for (var country in this.data) {
      if (this.compare_countries.includes(country)) {
        let d = this.data[country];
        for (var year in d) {
          if (parseInt(year) < self.start || parseInt(year) > self.end) continue;
          if (sum[year] == undefined && !isNaN(d[year])) {
            sum[year] = 0;
            counts[year] = 0;
          }
          if (!isNaN(d[year])) {
            counts[year]++;
            sum[year] += d[year];
          }
        };
      }
    }
    let averages = {};
    for (var year in sum) {
      averages[year] = 0;
      if (counts[year] == 0) continue;
      averages[year] = sum[year] / counts[year];
    }
    console.log("SRI LANKA", sl);
    console.log("COMPARE", sum);
    console.log("COUNTS", counts);
    console.log("AVERAGES", averages);

    let c = 0, t = 0;
    for (var key in sl) {
      c++;
      t += sl[key];
    }
    this.info.sl_avg = t / c;

    c = 0; t = 0;
    for (var key in sum) {
      t += sum[key];
    }
    for (var key in counts) {
      c += counts[key];
    }
    this.info.cp_avg = t / c;

    let data = [["Year", "Sri Lanka", "Compared"]];
    for (var i = this.gen.start; i <= this.gen.end; i++) {
      if (sl[i] == undefined) sl[i] = 0;
      if (averages[i] == undefined) averages[i] = 0;
      data.push([i, sl[i], averages[i]]);
    }
    console.log(data);
    this.chartData.dataTable = data;
    //this.loaded = true;
    setTimeout(function () {
      self.loaded = true;
    }, 1000)
  }

  change() {
    if (this.compare == "country") {

    }
    if(this.compare == "world"){

    }
  }
}

