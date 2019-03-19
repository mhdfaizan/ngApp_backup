import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'false-service-invoker',
  template: `
    <p>
      service-invoker works!
    </p>
  `,
  styles: []
})
export class ServiceInvokerComponent implements OnInit {

  
  constructor(private _http: HttpClient) { }

  getData(url, obj){
    return this._http.post<any>(url, obj);
  }

  ngOnInit() {
  }

}
