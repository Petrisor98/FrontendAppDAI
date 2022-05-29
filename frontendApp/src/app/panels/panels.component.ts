import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { saveAs } from 'file-saver';
import { ImageFilterService } from '../image-filter.service';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss'],
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
export class PanelsComponent implements OnInit {
  title = 'FrontendDesign';
  dragAreaClass!: string;
  position: string = 'null';
  urls: string[] = [];
  files: File[];
  response?: File;
  imgLoading: boolean = true;
  error!: string;
  testString?: string;

  constructor(private imageFilterService: ImageFilterService) {
    this.files = [];
    this.response = undefined;
  }

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

  onSelectedFile(event: any) {
    const files = event.target.files;
    console.log("selecting files")
    console.log(files);
    this.saveFiles(files);
  }

  saveFiles(files: FileList) {
    if (files) {
      // @ts-ignore
      this.files.push(files.item(0));
      for (let i = 0; i < files.length; i++) {
        const mimeType = files[i].type;
        if (mimeType.match(/image\/*/) == null) {
          this.error = "Only images must be uploaded!";
          continue;
        }
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result);
        }
        console.log("selecting files")
        console.log(files);
        console.log("pushed " + this.files.length + " files.");
      }
    }
  }


  applyFilter(type: string, level?: number) {
    console.log("applying filter on image of size" , this.files[0].size);
    console.log(this.files[0]);
    this.imgLoading = true;

    this.imageFilterService.applyFilter((this.files)[0], type, level).subscribe({
      next: (response: Blob) => {
        console.log(response);
        this.createImageFromBlob(response);
        this.imgLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.imgLoading = false;
        alert("error applying filter");
      },
    });
    this.response = new File([], "response");
  }

  /**
   * @return {Array} - an array of Blobs
   * @param file - file to slice
   * @param chunksAmount
   **/
  sliceFile(file: File, chunksAmount: number) {
    var byteIndex = 0;
    var chunks = [];

    for (var i = 0; i < chunksAmount; i += 1) {
      var byteEnd = Math.ceil((file.size / chunksAmount) * (i + 1));
      chunks.push(file.slice(byteIndex, byteEnd));
      byteIndex += (byteEnd - byteIndex);
    }

    return chunks;
  }

  downloadImg() {
    if (this.response != undefined) {
      let fileBlob: Blob = this.sliceFile(this.response, 1)[0];
      saveAs(fileBlob, 'filtered.png');
    }
  }


  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
      reader.onload = (events: any) => {
        this.response = events.target.result;
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
