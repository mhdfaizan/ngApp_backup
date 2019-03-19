import { Component, OnInit } from '@angular/core';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { interval } from "rxjs/internal/observable/interval";
import { startWith, switchMap, isEmpty } from "rxjs/operators";
import { Router } from '@angular/router';

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
  selectedBranchCode = "";
  selectedAsstYear = "";

  profileStatusCheck; // interval variable to check profile status by service polling

  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _router: Router) { }

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
    }, 10000);
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
          this.fileTypes = res['file_types'];
          this.branchCodes = res['branch_codes'];
          this.businessCodes = res['business_codes'];
          this.stateCodes = res['state_codes'];
          this.assessmentYears = res['assessment_years'];
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

  // pending branch code filter implementation
  filterProfiles() {
    if (this.selectedFileType == '') {
      if (this.selectedAsstYear == '') {
        this.profilesViewList = this.profiles;
      } else if (this.selectedAsstYear != '') {
        this.profilesViewList = this.profiles.filter(profile => profile.AssessmentYear == this.selectedAsstYear);
        console.log(this.selectedAsstYear);
        console.log(this.profilesViewList);
      }
    } else if (this.selectedFileType != '') {
      if (this.selectedAsstYear == '') {
        this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType);
      } else if (this.selectedAsstYear != '') {
        this.profilesViewList = this.profiles.filter(profile => profile.FileType == this.selectedFileType && profile.AssessmentYear == this.selectedAsstYear);
      }
    }
  }

  navToFeatures() {
    this._router.navigate(['/features']);
  }

  navToResults() {
    this._router.navigate(['/results']);
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