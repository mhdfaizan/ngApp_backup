import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'ngApp';
  username: string;

  public spinkit = Spinkit;

  constructor(private _router: Router) {
    if(this.userCheck()) {
      this._router.navigate[('profiles')];
    }
  }

  ngOnInit() {
    this.userCheck();
    if(this.userCheck()) {
      this._router.navigate[('/profiles')];
    }
  }

  ngDoCheck() {
    this.userCheck();
    if(this.userCheck()) {
      this._router.navigate[('profiles')];
    }
  }

  logout() {
    // this._authService.logoutUser();
    localStorage.removeItem('username');
    this._router.navigate(['login']);
  }

  userCheck(): boolean{
    let check = false;
    check = !!localStorage.getItem('username');
    if(check == true){
      this.username = localStorage.getItem('username');
    }
    return check;
  }
}
