import { Component, OnInit } from '@angular/core';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {
    username: '',
    password: ''
  };

  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _router: Router) { }

  ngOnInit() {
  }

  loginUser(){
    this._serviceInvoker.getData(this._apiUrls.loginDemo, {"user": this.loginUserData})
      .subscribe(
        res => {
          if(res.username != ''){
            console.log(res.username);
            localStorage.setItem('username', res.username);
            this._router.navigate(['/profiles']);
          } else {
            // this.showErrorAlert = true;
            console.log('login error !');
          }
        },
        error => console.log("ERROR: "+error)
      );
  }

}
