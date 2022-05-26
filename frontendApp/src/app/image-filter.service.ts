import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ImageFilterService {

  response?: string;

  constructor(private http: HttpClient) {
  }

  // generate the headers for content-type as JSON in a POST request
  genHeadersJSON(): any {
    return {
      headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
    };
  }

  // applying filter to image
  // filter can be of type sharpen, emboss, sepia, contrast, brightness, black_white, gaussian_blur, gradient or canny_edge_detection
  applyFilter(image: File, filter: string, level?: number): any {
    const formData: any = new FormData();
    formData.append("image", image);
    formData.append("filter", filter);
    if (level) {
      formData.append("level", level);
    }
    let blob_result: Blob;

    return this.http
      .post(environment.apiURL + "/filter", formData, {responseType: 'blob'})


  }



}
