import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ServiceInvokerComponent } from '../service-invoker/service-invoker.component';
import { ApiUrls } from '../api-urls';

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
  profileId = '1';

  cars: any = [];
  cols: any = [];



  nodeSelect(event) {
    console.log(this.selectedColumns);
    this.setSelectedColumnsAndFilterFields();
  }

  constructor(private _serviceInvoker: ServiceInvokerComponent, private _apiUrls: ApiUrls) { }

  ngOnInit() {
    this.getResults();
  }

  getResults() {
    this._serviceInvoker.getData(this._apiUrls.getProfileResults, { 'profileId': this.profileId })
      .subscribe(
        res => {
          console.log(res);
          //changing year dataype from decimal to number
          this.resultSet = res["Transposed"].map(item => {
            item.assessment_year = parseInt(item.assessment_year);
            return item;
          }); // REMOVE THIS HARDCODED COLUMN AND HANDLE IN SERVICE BACKEND
          this.cars = this.resultSet;
          console.log(this.cars);
          this.generateTree(this.resultSet);
          this.selectedColumns = [...this.treeData[0].children, ...this.treeData[1].children, ...this.treeData[2].children]; // creating array for pre-selection of columns 
          this.setSelectedColumnsAndFilterFields();
          this.statistics = res["Statistics"];
          this.statisticsHeaders = Object.keys(this.statistics[0]);
          // console.log(this.statisticsHeaders);
        }
      );
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
  }

  printRow(row) {
    console.log(row);
  }

  // setValue() {
  //   this.files =
  //     [
  //       {
  //         "label": "Documents",
  //         "data": "Documents Folder",
  //         "expandedIcon": "fa fa-folder-open",
  //         "collapsedIcon": "fa fa-folder",
  //         "children": [{
  //           "label": "Work",
  //           "data": "Work Folder",
  //           "expandedIcon": "fa fa-folder-open",
  //           "collapsedIcon": "fa fa-folder"
  //         },
  //         {
  //           "label": "Home",
  //           "data": "Home Folder",
  //           "expandedIcon": "fa fa-folder-open",
  //           "collapsedIcon": "fa fa-folder"
  //         },
  //         {
  //           "label": "Invoices.txt",
  //           "icon": "fa fa-file-word-o",
  //           "data": "Invoices for this month"
  //         },
  //         {
  //           "label": "Expenses.doc",
  //           "icon": "fa fa-file-word-o",
  //           "data": "Expenses Document"
  //         },
  //         {
  //           "label": "Resume.doc",
  //           "icon": "fa fa-file-word-o",
  //           "data": "Resume Document"
  //         }]
  //       },
  //       {
  //         "label": "Pictures",
  //         "data": "Pictures Folder",
  //         "expandedIcon": "fa fa-folder-open",
  //         "collapsedIcon": "fa fa-folder",
  //         "children": [
  //           { "label": "barcelona.jpg", "icon": "fa fa-file-image-o", "data": "Barcelona Photo" },
  //           { "label": "logo.jpg", "icon": "fa fa-file-image-o", "data": "PrimeFaces Logo" },
  //           { "label": "primeui.png", "icon": "fa fa-file-image-o", "data": "PrimeUI Logo" }]
  //       },
  //       {
  //         "label": "Movies",
  //         "data": "Movies Folder",
  //         "expandedIcon": "fa fa-folder-open",
  //         "collapsedIcon": "fa fa-folder",
  //         "children": [{
  //           "label": "Al Pacino",
  //           "data": "Pacino Movies",
  //           // "children": [{ "label": "Scarface", "icon": "fa fa-file-video-o", "data": "Scarface Movie" }, { "label": "Serpico", "icon": "fa fa-file-video-o", "data": "Serpico Movie" }]
  //         },
  //         {
  //           "label": "Robert De Niro",
  //           "data": "De Niro Movies",
  //           // "children": [{ "label": "Goodfellas", "icon": "fa fa-file-video-o", "data": "Goodfellas Movie" }, { "label": "Untouchables", "icon": "fa fa-file-video-o", "data": "Untouchables Movie" }]
  //         }]
  //       }
  //     ];
  // }

}
