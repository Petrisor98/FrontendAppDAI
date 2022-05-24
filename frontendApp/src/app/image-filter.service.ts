import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ImageFilterService {

  constructor(private http: HttpClient) { }

  // generate the headers for content-type as JSON in a POST request
  genHeadersJSON(): any {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
  
  // applying filter to image 
  // filter can be sharpen, emboss, sepia, constrast, brightness, black_white, gaussian_blur, gradient or canny_edge_detection
  applyFilter(image: File, filter: string): any {
    const body = {image: image, filter: filter};
    return this.http.post(environment.apiURL, JSON.stringify(body), this.genHeadersJSON());
  }
}