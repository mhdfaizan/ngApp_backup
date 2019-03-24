import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';
import { DataSharingService } from '../data-sharing.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  dtOptions: DataTables.Settings = {}; //settings for angular datatable
  selectedColumns: TreeNode[]; // selected columns from tree for displaying in table
  tableHeaders = []; // column headers extracted from results service
  treeData: TreeNode[]; // object for showing tree with nodes 
  resultSet = []; // actual data from results service
  statistics = []; // ratio summary data from results service
  filterFields: any[]; // columns names extracted from selected columns to be used for table filtering  
  statisticsHeaders = []; // headers extracted from statistics object for summary table
  profileId = "";
  profileObject = {};
  resultsAccumalator = [];
  resultsCheck: boolean = true;
  selectedRow: any = {};
  reportCardData = [];
  reportCardDataHeaders = [];

  cars: any = [];
  cols: any = [];

  count = 3;
  limit = 100;
  offset = 1;

  nodeSelect(event) {
    console.log(this.selectedColumns);
    this.setSelectedColumnsAndFilterFields();
  }

  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls, private _dataService: DataSharingService) { }

  ngOnInit() {
    this._dataService.currentProfileObj.subscribe(obj => this.profileObject = obj);
    console.log(this.profileObject);
    this._dataService.currentProfileId.subscribe(id => this.profileId = id.toString());
    console.log(this.profileId);
    // this.getResults();
    this.getAllResults();
  }

  getAllResults() {
    this._serviceInvoker.getData(this._apiUrls.getProfileResults, { 'profileId': this.profileId, 'limit': this.limit, 'offset': this.offset })
      .subscribe(
        res => {
          console.log(res);
          // if (res["Transposed"].length > 0 && this.count > 0) {
          if (this.count > 0) { // INSERT RES CHECK WHEN ACTUAL SERVICE IS USED
            this.count -= 1;
            this.resultsAccumalator.push(...res["Transposed"]);
            console.log(this.resultsAccumalator);
            this.limit += 100;
            this.offset += 100;
            this.getAllResults();
          } else {
            this.setStatistics(res);
            console.log(this.resultsAccumalator); 
            this.changeDecimalToNumber(this.resultsAccumalator);
            this.cars = this.resultSet;
            console.log(this.cars);
            this.generateTree(this.resultSet);
            this.preselectColumns();
            this.setSelectedColumnsAndFilterFields();
          }
        },
        err => console.log(err)
      );
  }

  setStatistics(response) {
    this.statistics = response["Statistics"];
    this.statisticsHeaders = Object.keys(this.statistics[0]);
  }

  changeDecimalToNumber(resTransposed) {
    this.resultSet = resTransposed.map(item => {
      item.assessment_year = parseInt(item.assessment_year);
      return item;
    });
  }

  preselectColumns() {
    this.selectedColumns = [...this.treeData[0].children, ...this.treeData[1].children, ...this.treeData[2].children]; // creating array for pre-selection of columns 
  }

  generateTree(res) {
    this.tableHeaders = Object.keys(res[0]);
    this.treeData =
      [
        {
          "label": "Values",
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "selectable": false,
          "children": []
        },
        {
          "label": "Scores",
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "selectable": false,
          "children": []
        },
        {
          "label": "Ranks",
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "selectable": false,
          "children": []
        }
      ];
    for (let i = 0; i < this.tableHeaders.length; i++) {
      if (this.tableHeaders[i].indexOf("rank") !== -1) {
        this.treeData[2]['children'].push({ 'label': this.tableHeaders[i] });
      } else if (this.tableHeaders[i].indexOf("score") !== -1) {
        this.treeData[1]['children'].push({ 'label': this.tableHeaders[i] });
      } else if (this.tableHeaders[i].indexOf("score") == -1 && this.tableHeaders[i].indexOf("rank") == -1) {
        this.treeData[0]['children'].push({ 'label': this.tableHeaders[i] });
      }
    }
    console.log(this.treeData);
  }

  setSelectedColumnsAndFilterFields() {
    this.cols = this.selectedColumns;
    this.cols = this.selectedColumns.filter(item => {
      if ((item.label != 'Values') && (item.label != 'Ranks') && (item.label != 'Scores')) {
        return item;
      }
    });
    this.filterFields = this.cols.map(item => item.label);
    console.log(this.filterFields);
    console.log(this.cols);
  }

  showReportCard(row) {
    console.log(row);
    this.selectedRow = row;
    this._serviceInvoker.getData(this._apiUrls.getReportCard, { 'Profile_Id': this.profileId, 'It_ref_Nos': row.taxpayer })
      .subscribe(
        res => {
          console.log(res);
          this.reportCardData = res;
          this.reportCardDataHeaders = Object.keys(this.reportCardData[0]);
        },
        err => console.log(err)
      );
  }

}
