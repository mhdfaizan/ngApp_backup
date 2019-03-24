import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { Router } from '@angular/router';
import { getQueryPredicate } from '@angular/compiler/src/render3/view/util';
import { DataSharingService } from '../data-sharing.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  showSelectModel = false;
  showFeatureDetail = false;

  models = [];
  fileTypes = [];
  branchCodes = [];
  businessCodes = [];
  stateCodes = [];
  assessmentYears = [];
  featuresList = [];
  groupedFeaturesList = [];
  featureForDetail: any = {};

  profileName = "";
  selectedFileType = "";
  selectedBranchCode = "";
  selectedBusinessCode = "";
  selectedStateCode = "";
  selectedAsstYear = "";
  selectedModelName: string = "";
  selectedModelId = "";

  selectedFilter = "";
  valueOne = "";
  valueTwo = "";
  disableSaveFilter = true;

  countMessage = "";
  countCheck = "";
  displayCountModal = "none";

  profileIdForEdit = 0;
  profileObjForEdit: any = {};


  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _router: Router, private _dataService: DataSharingService) { }

  ngOnInit() {
    this.getDropDownData();
    this.getModelsData();
    this._dataService.currentProfileId.subscribe(id => this.profileIdForEdit = id);
    console.log(this.profileIdForEdit);
    if (this.profileIdForEdit != 0) {
      this._dataService.currentProfileObj.subscribe(obj => {
        // get profile object from data service
        this.profileObjForEdit = obj;
        console.log(this.profileObjForEdit);
        this.selectedModelId = this.profileObjForEdit.ModelID;
        this.selectedModelName = this.profileObjForEdit.ModelName;
        this.displaySelectModel();
        this.selectedFileType = this.profileObjForEdit.FileType;
        this.selectedAsstYear = this.profileObjForEdit.AssessmentYear;
        this.selectedBranchCode = this.profileObjForEdit.BranchCode == null ? '' : this.profileObjForEdit.BranchCode == 'all' ? '' : this.profileObjForEdit.BranchCode;
        this.selectedBusinessCode = this.profileObjForEdit.BusinessCode == null ? '' : this.profileObjForEdit.BusinessCode == 'all' ? '' : this.profileObjForEdit.BusinessCode;
        this.selectedStateCode = this.profileObjForEdit.StateCode == null ? '' : this.profileObjForEdit.StateCode == 'all' ? '' : this.profileObjForEdit.StateCode;
        this.profileName = this.profileObjForEdit.ProfileName;
        console.log((JSON.parse(this.profileObjForEdit.ProfileParametersJson)).Features);
        this.featuresList = (JSON.parse(this.profileObjForEdit.ProfileParametersJson)).Features;
        this.featuresByGroups();
        console.log({ ungrouped: this.featuresList }, { grouped: this.groupedFeaturesList });
      });
    } else {
    }
  }

  showCountModal(modalCheck: boolean) {
    if (modalCheck) {
      this.displayCountModal = "block";
    } else {
      this.displayCountModal = "none";
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

  getModelsData() {
    this._serviceInvoker.getData(this._apiUrls.getAllModels, { "includeFeatures": "false" })
      .subscribe(
        res => {
          this.models = res;
          // for (let model of res) {
          //   // console.log(model);
          //   this.models.push({ name: model.ModelName, code: model.ModelID });
          // }
          console.log({ models: this.models });
        },
        err => {
          console.log(err);
        }
      );
  }

  getFeaturesForModel() {
    console.log(this.selectedModelId);
    this.setSelectedModelName(this.selectedModelId)
    this.showFeatureDetail = false;

    this._serviceInvoker.getData(this._apiUrls.getFeaturesByModel, { "Id": this.selectedModelId })
      .subscribe(
        res => {
          console.log(res);
          this.featuresList = res;
          this.featuresList.map(feature => feature.Filters = [{ 'Type': '', 'Values': [''] }]);
          this.featuresByGroups();
          console.log({ featureList: this.featuresList }, { grouped: this.groupedFeaturesList });
        },
        err => {
          console.log(err);
        }
      );
  }

  setSelectedModelName(modelId) {
    let model = this.models.filter(item => item.ModelID == modelId);
    console.log(model);
    this.selectedModelName = model[0].ModelName;
  }

  featuresByGroups() {
    var groups = new Set(this.featuresList.map(item => item.FeatureGroup));
    this.groupedFeaturesList = [];
    groups.forEach(g =>
      this.groupedFeaturesList.push({
        name: g,
        values: this.featuresList.filter(i => i.FeatureGroup === g)
      }
      ));
  }

  displaySelectModel() {
    // this.getModelsData();
    if (this.showSelectModel != true) {
      this.showSelectModel = !this.showSelectModel;
    }
  }

  showFeatureFilters(selectedFeature) {
    console.log(selectedFeature);
    this.featureForDetail = selectedFeature;

    if (this.featureForDetail != null && this.showFeatureDetail == false) {
      this.showFeatureDetail = !this.showFeatureDetail;
    }
    this.setFilterValues(selectedFeature);
  }

  setFilterValues(selectedFeature) {
    this.selectedFilter = selectedFeature.Filters[0].Type == null ? '' : selectedFeature.Filters[0].Type;
    this.valueOne = selectedFeature.Filters[0].Values[0];
    this.valueTwo = selectedFeature.Filters[0].Values[1];
    console.log(this.featuresList);
  }

  checkDisable(): boolean {
    if (this.selectedFilter != '') {
      if (this.selectedFilter != 'IS NULL' && this.selectedFilter != 'IS NOT NULL') {
        if (this.selectedFilter != 'Between') {
          if (this.valueOne != null && this.valueOne.length != 0 && this.valueOne != '') {
            this.disableSaveFilter = false;
          } else {
            this.disableSaveFilter = true;
          }
        } else if (this.selectedFilter == 'Between') {
          if ((this.valueOne != null && this.valueOne.length != 0 && this.valueOne != '') && (this.valueTwo != null && this.valueTwo.length != 0 && this.valueTwo != '')) {
            this.disableSaveFilter = false;
          } else {
            this.disableSaveFilter = true;
          }
        }
      } else if (this.selectedFilter == 'IS NULL' || this.selectedFilter == 'IS NOT NULL') {
        this.disableSaveFilter = false;
      }
    } else {
      this.disableSaveFilter = true;
    }
    return this.disableSaveFilter;
  }

  saveFilter(featureId) {
    const objIndex = this.featuresList.findIndex((obj => obj.FeatureID == featureId));

    if (this.selectedFilter != 'Between') {
      this.featuresList[objIndex].Filters[0].Type = this.selectedFilter;
      this.featuresList[objIndex].Filters[0].Values[0] = this.valueOne;
    } else if (this.selectedFilter == 'Between') {
      this.featuresList[objIndex].Filters[0].Type = this.selectedFilter;
      this.featuresList[objIndex].Filters[0].Values[0] = this.valueOne.toString();
      this.featuresList[objIndex].Filters[0].Values[1] = this.valueTwo.toString();
    }
    console.log(this.featuresList);
  }

  createProfile() {
    if (this.profileIdForEdit != 0) {
      const obj = {
        ProfileID: this.profileIdForEdit,
        ProfileName: this.profileName,
        ModelID: this.selectedModelId,
        ModelName: this.selectedModelName,
        UserID: 25,
        Year: this.selectedAsstYear,
        User: "Administrator", //TODO: get from local storage
        FileType: this.selectedFileType,
        BranchCode: this.selectedBranchCode ? '' : 'all',
        Saved: false,
        StateCode: this.selectedStateCode ? '' : 'all',
        BusinessCode: this.selectedBusinessCode ? '' : 'all',
        Features: this.featuresList
      };

      console.log({ EditProfileObject: obj });
      this.getQueryCount(obj, true);

    } else {
      const obj = {
        ProfileName: this.profileName,
        ModelID: this.selectedModelId,
        ModelName: this.selectedModelName,
        UserID: 25,
        Year: this.selectedAsstYear,
        User: "Administrator", //TODO: get from local storage
        FileType: this.selectedFileType,
        BranchCode: this.selectedBranchCode ? '' : 'all',
        Saved: false,
        StateCode: this.selectedStateCode ? '' : 'all',
        BusinessCode: this.selectedBusinessCode ? '' : 'all',
        Features: this.featuresList
      };

      console.log({ CreateProfileObject: obj });
      this.getQueryCount(obj, false);
    }
  }

  getQueryCount(obj, isEdit: boolean) {
    this._serviceInvoker.getData(this._apiUrls.getQueryCount, { "Profile": obj })
      .subscribe(
        res => {
          console.log(res);
          if (res.flag == false) {
            this.countMessage = res.message;
            this.showCountModal(true);
          } else {
            if (isEdit) {
              console.log("edit profile");
              // this.postEditProfileData(obj)
            } else {
              console.log("create profile");
              // this.postProfileData(obj);
            }
          }
        },
        err => console.log(err)
      );
  }

  postProfileData(obj) {
    this._serviceInvoker.getData(this._apiUrls.createProfile, { "Profile": obj })
      .subscribe(
        res => {
          console.log(res.ProfileID);
          if (res.ProfileID) {
            this.navToProfiles("slow");
          }
        },
        err => console.log(err)
      );
  }

  postEditProfileData(obj) {
    this._serviceInvoker.getData(this._apiUrls.editProfile, { "Profile": obj })
      .subscribe(
        res => {
          console.log(res.ProfileID);
          if (res.ProfileID) {
            this.navToProfiles("slow");
          }
        },
        err => console.log(err)
      );
  }

  navToProfiles(speed: string) {
    if (speed == 'slow') {
      setTimeout(() => {
        this._router.navigate(['/profiles']);
      }, 2500)
    } else if (speed == 'fast') {
      this._router.navigate(['/profiles']);
    }
  }
}
