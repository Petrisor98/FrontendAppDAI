import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Cookie} from "ng2-cookies";


@Injectable({
  providedIn: 'root'
})
export class ImageFilterService {

  response?: string;

  constructor(private http: HttpClient) {
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
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + Cookie.get('access_token')});

    return this.http
      .post( environment.apiURL + "/filter", formData, {headers: headers, responseType: 'blob' })

  }
}
