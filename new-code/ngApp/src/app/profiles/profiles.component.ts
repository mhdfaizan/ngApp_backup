import { Component, OnInit } from '@angular/core';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { interval } from "rxjs/internal/observable/interval";
import { startWith, switchMap, isEmpty } from "rxjs/operators";
import { Router } from '@angular/router';
import { DataSharingService } from '../data-sharing.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  showDetail = false; //for profile details pane

  fileTypes = []; // dropdown
  branchCodes = []; // dropdown
  businessCodes = []; // dropdown
  stateCodes = []; // dropdown
  assessmentYears = []; // dropdown

  profiles = []; // all profile from service
  profilesViewList = [] // profiles to display on screen (created to assist in filtering profiles)
  detailProfile: any = {}; // selected profile object for showing details 
  profilesInQueue = []; // filtered profiles having status other than 'Done'

  selectedFileType = "";
  selectedAsstYear = "";
  selectedBranchCode = "";

  profileStatusCheck; // interval variable to check profile status by service polling

  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _router: Router, private _dataService: DataSharingService) { }

  ngOnInit() {
    this.getDropDownData();
    this.getAllProfiles();

    //profile service polling
    this.profileStatusCheck = setInterval(() => {
      this._serviceInvoker.getData(this._apiUrls.getAllProfiles, {})
        .subscribe(
          res => {
            this.profiles = res;
            console.log(this.profiles);

            //filter profiles that have job status other than 'Done'
            this.profilesInQueue = this.profiles.filter(profile => profile.JobStatus != 'Done');

            //to update profile details pane when profile is selected and it's status changes
            if (Object.keys(this.detailProfile).length != 0) {
              //selecting first element of the filtered array and assign it to the detailProfile object
              this.detailProfile = this.profiles.filter(profile => this.detailProfile.ProfileID == profile.ProfileID)[0];
              console.log(this.detailProfile);
            }

            console.log(this.profilesInQueue.length);
            //stopping profile service polling if all profiles have status 'Done'
            if (this.profilesInQueue.length == 0) {
              clearInterval(this.profileStatusCheck);
            }
          },
          err => {
            console.log(err);
          }
        );
    }, 15000);
  }

  showProfileDetail(profile) {
    console.log(profile);
    this.detailProfile = profile;
    if (this.detailProfile != null && this.showDetail == false) {
      this.showDetail = !this.showDetail;
    }
  }

  getDropDownData() {
    this._serviceInvoker.getData(this._apiUrls.getDropdowns, {})
      .subscribe(
        res => {
          console.log(res);
          this.fileTypes = ['C', 'OG', 'SG', 'D'];
          // console.log(this.fileTypes);
          this.branchCodes = JSON.parse(res['branchCode']);
          // console.log(this.branchCodes);
          this.businessCodes = JSON.parse(res['businessCode']);
          // console.log(this.businessCodes);
          this.stateCodes = JSON.parse(res['stateCode']);
          // console.log(this.stateCodes);
          this.assessmentYears = JSON.parse(res['assessmentYear']);
          // console.log(this.assessmentYears);
        },
        err => {
          console.log(err);
        }
      );
  }

  getAllProfiles() {
    this._serviceInvoker.getData(this._apiUrls.getAllProfiles, {})
      .subscribe(
        res => {
          this.profiles = res;
          this.profilesViewList = res;
          console.log(this.profiles);
        },
        err => {
          console.log(err);
        }
      );
  }

  filterProfiles() {
    if (this.selectedFileType == '') {
      if (this.selectedAsstYear == '') {
        if (this.selectedBranchCode == '') {
          this.profilesViewList = this.profiles;
        } else if (this.selectedBranchCode != '') {
          this.profilesViewList = this.profiles.filter(profile => profile.BranchCode == this.selectedBranchCode);
        }
      } else if (this.selectedAsstYear != '') {
        if (this.selectedBranchCode == '') {
          this.profilesViewList = this.profiles.filter(profile => profile.AssessmentYear == this.selectedAsstYear);
        } else if (this.selectedBranchCode != '') {
          this.profilesViewList = this.profiles.filter(profile => profile.AssessmentYear == this.selectedAsstYear && profile.BranchCode == this.selectedBranchCode);
        }
      }
    } else if (this.selectedFileType != '') {
      if (this.selectedAsstYear == '') {
        if (this.selectedBranchCode == '') {
          this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType);
        } else if (this.selectedBranchCode != '') {
          this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType && profile.BranchCode == this.selectedBranchCode);
        }
      } else if (this.selectedAsstYear != '') {
        if (this.selectedBranchCode == '') {
          this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType && profile.AssessmentYear == this.selectedAsstYear);
        } else if (this.selectedBranchCode != '') {
          this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType && profile.AssessmentYear == this.selectedAsstYear && profile.BranchCode == this.selectedBranchCode);
        }

      }
    }
  }

  navToFeatures() {
    this._dataService.changeProfileId(0);
    this._router.navigate(['/features']);
  }

  navToFeaturesWithEdit() {
    this._dataService.changeProfileId(this.detailProfile.ProfileID);
    this._serviceInvoker.getData(this._apiUrls.getProfileObject, { 'id': this.detailProfile.ProfileID })
      .subscribe(
        res => {
          console.log(res);
          this._dataService.changeProfileObj(res);
          this._router.navigate(['/features']);
        },
        err => console.log(err)
      )
  }

  navToResults() {
    this._dataService.changeProfileObj(this.detailProfile);
    this._dataService.changeProfileId(this.detailProfile.ProfileID);
    this._router.navigate(['/results']);
  }

  saveProfile() {
    this._serviceInvoker.getData(this._apiUrls.saveProfile, { 'profileId': this.detailProfile.ProfileId })
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }

  ngOnDestroy() {
    clearInterval(this.profileStatusCheck);
  }
}

// FOR LATER USE
// if (this.profilesInQueue == null && this.profilesInQueue.length != 0) {
    // interval(5000)
    //   .pipe(
    //     startWith(0),
    //     switchMap(() => this._serviceInvoker.getData(this._apiUrls.getAllProfiles, {}))
    //   )
    //   .subscribe(
    //     res => {
    //       this.profiles = res;
    //       this.profilesInQueue = this.profiles.filter(profile => profile.JobStatus != 'Done');
    //       console.log(this.profiles);
    //       console.log(this.profilesInQueue.length);
    //       if(this.profilesInQueue.length > 0){
    //         clearInterval();
    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
// }