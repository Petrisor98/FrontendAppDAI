import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('photoState', [
      state('move', style({
        transform: 'translateX(-100%) translateY(50px)',
      })),
      state('enlarge', style({
        transform: 'scale(1.5)',
      })),
      state('spin', style({
        transform: 'rotateY(180deg) rotateZ(90deg)',
      })),
      transition('spin => move', animate('2000ms ease-out')),
      transition('* => *', animate('500ms ease'))
    ])
  ]
})

export class AppComponent {
  title = 'FrontendDesign';
  dragAreaClass!: string;
  position: string = 'null';
  photoUrl1 = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*';
  urls: string[] = [];
  error!: string;
  
  ngOnInit() {
    this.dragAreaClass = "dragarea";
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  changePos(newPos: string) {
    this.position = newPos;
  }

  onSelectedFile(event: any) {
    var files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const mimeType = files[i].type;
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (events: any) => { 
          this.urls.push(events.target.result); 
        }
      }
    }
  }

  saveFiles(files: FileList) {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const mimeType = files[i].type;
        if (mimeType.match(/image\/*/) == null) {
          this.error = "Only images must be uploaded!";
          continue;
        }
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (events: any) => { 
          this.urls.push(events.target.result);
        }
      }
    }  
  }

  deleteImage(url: any): void {
    this.urls = this.urls.filter((a) => a !== url);
  }

  public ngAfterViewInit(): void {
    this.createChartGauge();
    this.createChartPie();
    this.createChartLine();
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private createChartGauge(): void {
    const chart = Highcharts.chart('chart-gauge', {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text: 'Gauge Chart',
      },
      credits: {
        enabled: false,
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '85%'],
        size: '160%',
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
        },
      },
      yAxis: {
        min: 0,
        max: 25,
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'], // red
        ],
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -25,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      series: [{
        name: null,
        data: [this.getRandomNumber(0, 100)],
        dataLabels: {
          format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
        },
      }],
    } as any);

    setInterval(() => {
      chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    }, 1000);
  }

  private createChartPie(): void {
    let date = new Date();
    const data: any[] = [];

    for (let i = 0; i < 5; i++) {
      date.setDate(new Date().getDate() + i);
      data.push({
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        y: this.getRandomNumber(0, 1000),
      });
    }

    const chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pie Chart',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: `<span class="mb-2">Date: {point.key}</span><br>`,
        pointFormat: '<span>Amount: {point.y}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '50%',
        data,
      }],
    } as any);

    setInterval(() => {
      date.setDate(date.getDate() + 1);
      chart.series[0].addPoint({
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        y: this.getRandomNumber(0, 1000),
      }, true, true);
    }, 1500);
  }

  private createChartLine(): void {
    let date = new Date();
    const data: any[] = [];

    for (let i = 0; i < 10; i++) {
      date.setDate(new Date().getDate() + i);
      data.push([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)]);
    }

    const chart = Highcharts.chart('chart-line', {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Line Chart',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: null,
        }
      },
      xAxis: {
        type: 'category',
      },
      tooltip: {
        headerFormat: `<div>Date: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        shared: true,
        useHTML: true,
      },
      series: [{
        name: 'Amount',
        data,
      }],
    } as any);

    setInterval(() => {
      date.setDate(date.getDate() + 1);
      chart.series[0].addPoint([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)], true, true);
    }, 1500);
  }
}
