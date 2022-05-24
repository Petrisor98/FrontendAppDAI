import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';

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
<<<<<<< HEAD

  deleteImage(url: any): void {
    this.urls = this.urls.filter((a) => a !== url);
  }
}
=======
}
>>>>>>> 4b927e0cd10727410d80016c57e946fc87928975
