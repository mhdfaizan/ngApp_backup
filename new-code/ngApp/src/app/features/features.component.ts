import { Component, OnInit } from '@angular/core';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { Router } from '@angular/router';

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
  selectedModel: any = {};

  selectedFilter = "";
  valueOne = "";
  valueTwo = "";
  disableSaveFilter = true;


  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _router: Router) { }

  ngOnInit() {
    this.getDropDownData();
    this.getModelsData();
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

  getModelsData() {
    this._serviceInvoker.getData(this._apiUrls.getAllModels, { "includeFeatures": "false" })
      .subscribe(
        res => {
          console.log(res);
          for (let model of res) {
            console.log(model);
            this.models.push({ name: model.ModelName, code: model.ModelID });
          }
          console.log(this.models);
        },
        err => {
          console.log(err);
        }
      );
  }

  getFeaturesForModel(selectedModel) {
    console.log(selectedModel);
    this.showFeatureDetail = false;

    this._serviceInvoker.getData(this._apiUrls.getFeaturesByModel, { "Id": selectedModel.code })
      .subscribe(
        res => {
          this.featuresList = res;
          this.featuresList.map(feature => feature.Filters = [{ 'Type': '', 'Values': [''] }]);
          this.featuresByGroups();
          console.log(res);
          console.log(this.groupedFeaturesList);
        },
        err => {
          console.log(err);
        }
      );
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
    this.selectedFilter = selectedFeature.Filters[0].Type;
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

    const obj = {
      ProfileName: this.profileName,
      ModelID: this.selectedModel.code,
      ModelName: this.selectedModel.name,
      UserID: 25,
      Year: this.selectedAsstYear,
      User: "Administrator", //TODO: get from local storage
      FileType: this.selectedFileType,
      BranchCode: this.selectedBranchCode,
      Saved: false,
      StateCode: this.selectedStateCode,
      BusinessCode: this.selectedBusinessCode,
      Features: this.featuresList
    };
    //console.log(JSON.stringify(obj));
    console.log(obj);
    this.postProfileData(obj);
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
