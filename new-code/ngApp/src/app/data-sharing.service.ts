import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private profileId = new BehaviorSubject(0);
  private profileObj = new BehaviorSubject({});

  currentProfileId = this.profileId.asObservable();
  currentProfileObj = this.profileObj.asObservable();

  constructor() { }

  changeProfileObj(object){
    this.profileObj.next(object);
  }

  changeProfileId(id){
    this.profileId.next(id);
  }
}
