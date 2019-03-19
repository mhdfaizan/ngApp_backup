const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const dropdowns = require('../models/dropdowns.json');
const results = require('../models/results_new.json');
const profiles = require('../models/profiles.json');
const models = require('../models/models.json');



const db = 'mongodb://admin:admin123@ds227594.mlab.com:27594/eventsdb';

mongoose.connect(db, (error) => {
    if (error) {
        console.log(`Error: ${error}`);
    } else {
        console.log('connection to mongodb successful');
    }
});

const verifytoken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized Request');
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized Request');
    }
    req.userId = payload.subject;
    next()

}

//JSON FILE BASED SERVICES
router.post('/dropdowns', (req, res) => {
    res.send(dropdowns);
});

router.post('/results', (req, res) => {
    const _profileId = req.body.profileId;
    console.log(_profileId);
    res.send(results);
});

router.post('/getallprofiles', (req, res) => {
    res.send(profiles);
});

router.post('/getallmodels', (req, res) => {
    res.send(models);
});

router.post('/getfeaturesbymodelid_new', (req, res) => {
    res.send(models);
});



//OLD SERVICES
router.get('/', (req, res) => {
    res.send('from API router');
});

router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            let payload = {
                subject: registeredUser._id
            };
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({
                token
            });
        }
    });
});


router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({
        email: userData.email
    }, (error, user) => {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            if (!user) {
                res.status(400).send('Invalid Email');
            } else if (user.password !== userData.password) {
                res.status(401).send('Invalid Password');
            } else {
                let payload = {
                    subject: user.id
                };
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({
                    token
                });
            }
        }
    });
});

router.post('/loginDemo', (req, res) => {
    let userData = req.body.user;
    console.log(userData);
    if (userData.username == 'admin') {
        if (userData.password == 'admin') {
            res.status(200).send({
                'username': "Administrator"
            });
        } else {
            res.status(200).send({
                'username': ""
            });
            // res.status(401).send('Invalid Password');
        }
    } else {
        res.status(200).send({
            'username': ""
        });
        //res.status(400).send('Invalid Username');
    }
});

router.get('/events', (req, res) => {
    let events = [{
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "4",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "5",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "6",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ];

    res.json(events);
});

router.get('/special', verifytoken, (req, res) => {
    let events = [{
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "5",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "6",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ];

    res.json(events);
});

router.post('/allmodels', (req, res) => {
    let models = [{
            "ModelID": 1,
            "ModelName": "Model 1",
            "ModelDescription": "Model 1 Description"
        },
        {
            "ModelID": 2,
            "ModelName": "Model 2",
            "ModelDescription": "Model 2 Description"
        },
        {
            "ModelID": 3,
            "ModelName": "Model 3",
            "ModelDescription": "Model 3 Description"
        },
        {
            "ModelID": 4,
            "ModelName": "Model 4",
            "ModelDescription": "Model 4 Description"
        }
    ];

    res.json(models);
});

router.post('/getallprofiles_old', (req, res) => {
    let profiles = [{
            "ProfileID": 1,
            "ProfileName": "Testing One",
            "ModelID": 1,
            "ModelName": "Model 1",
            "FeatureQuery": "Query",
            "UserID": 1,
            "AssessmentYear": 2014,
            "User": "buser1",
            "FileType": "File Type 1",
            "JobStatus": "In Queue"
        },
        {
            "ProfileID": 2,
            "ProfileName": "Test Four",
            "ModelID": 2,
            "ModelName": "Model 1",
            "ODSQuery": "Query",
            "UserID": 1,
            "AssessmentYear": 2018,
            "User": "buser2",
            "FileType": "File Type 2",
            "JobStatus": "Assigned"
        },
        {
            "ProfileID": 5,
            "ProfileName": "Commercial Profile",
            "ModelID": 3,
            "ModelName": "Model 2",
            "ODSQuery": "Query ",
            "UserID": 1,
            "AssessmentYear": 2017,
            "User": "buser3",
            "FileType": "File Type 1",
            "JobStatus": "Done"
        }
    ];

    res.json(profiles);
});

router.post('/getfeaturesbymodelid', (req, res) => {
    const _id = req.body.Id;
    let features = [];
    if (_id == 1) {
        features = [{
                "FeatureID": 1,
                "FeatureName": "PLANT_AND_MACHINERY",
                "FeatureDescription": "Feature 1 Des",
                "FeatureGroup": "ASSETS",
                "FeatureDataType": "numeric",
                "TableName": "financialfact_ods"
            },
            {
                "FeatureID": 2,
                "FeatureName": "TOTAL_ASSETS",
                "FeatureDescription": "Feature 2 Des",
                "FeatureGroup": "ASSETS",
                "FeatureDataType": "numeric",
                "TableName": "financialfact_ods"
            },
            {
                "FeatureID": 3,
                "FeatureName": "TRADE_DEBTORS",
                "FeatureDescription": "Feature 3 Des",
                "FeatureGroup": "ASSETS",
                "FeatureDataType": "numeric",
                "TableName": "financialfact_ods"
            },
            {
                "FeatureID": 4,
                "FeatureName": "LOANS_FROM_OUTSIDE_MALAYSIA",
                "FeatureDescription": "Feature 4 Des",
                "FeatureGroup": "INTERCOMPANY",
                "FeatureDataType": "numeric",
                "TableName": "related_comp_fact_ods"
            },
            {
                "FeatureID": 5,
                "FeatureName": "TOTAL_PURCHASE_OUTSIDE_MALAYSI",
                "FeatureDescription": "Feature 5 Des",
                "FeatureGroup": "INTERCOMPANY",
                "FeatureDataType": "numeric",
                "TableName": "related_comp_fact_ods"
            },
            {
                "FeatureID": 6,
                "FeatureName": "OTHER_PAYMENT_OUTSIDE_MALAYSIA",
                "FeatureDescription": "Feature 1 Des",
                "FeatureGroup": "INTERCOMPANY",
                "FeatureDataType": "numeric",
                "TableName": "related_comp_fact_ods"
            },
            {
                "FeatureID": 7,
                "FeatureName": "RECEIPT_FROM_OUTSIDE_MALAYSIA",
                "FeatureDescription": "Feature 2 Des",
                "FeatureGroup": "INTERCOMPANY",
                "FeatureDataType": "numeric",
                "TableName": "related_comp_fact_ods"
            },
            {
                "FeatureID": 8,
                "FeatureName": "TOTAL_SALES_OUTSIDE_MALAYSIA",
                "FeatureDescription": "Feature 3 Des",
                "FeatureGroup": "INTERCOMPANY",
                "FeatureDataType": "numeric",
                "TableName": "related_comp_fact_ods"
            },
            {
                "FeatureID": 9,
                "FeatureName": "PROMO_ADVERT_EXPENSE",
                "FeatureDescription": "Feature 4 Des",
                "FeatureGroup": "EXPENSE",
                "FeatureDataType": "numeric",
                "TableName": "financialfact_ods"
            },
            {
                "FeatureID": 10,
                "FeatureName": "COST_OF_GOODS_SOLD",
                "FeatureDescription": "Feature 5 Des",
                "FeatureGroup": "EXPENSE",
                "FeatureDataType": "numeric",
                "TableName": "financialfact_ods"
            },
            {
                "FeatureID": 40,
                "FeatureName": "Feature 6",
                "FeatureDescription": "Feature 6 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            },
            {
                "FeatureID": 42,
                "FeatureName": "Feature 7",
                "FeatureDescription": "Feature 7 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 2"
            },
            {
                "FeatureID": 34,
                "FeatureName": "Feature 11",
                "FeatureDescription": "Feature 11 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            },
            {
                "FeatureID": 35,
                "FeatureName": "Feature 12",
                "FeatureDescription": "Feature 12 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            }
        ];
    } else if (_id == 2) {
        features = [{
                "FeatureID": 40,
                "FeatureName": "Feature 6",
                "FeatureDescription": "Feature 6 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            },
            {
                "FeatureID": 42,
                "FeatureName": "Feature 7",
                "FeatureDescription": "Feature 7 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 2"
            },
            {
                "FeatureID": 44,
                "FeatureName": "Feature 8",
                "FeatureDescription": "Feature 8 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 1"
            },
            {
                "FeatureID": 46,
                "FeatureName": "Feature 9",
                "FeatureDescription": "Feature 9 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 4"
            },
            {
                "FeatureID": 48,
                "FeatureName": "Feature 10",
                "FeatureDescription": "Feature 10 Des",
                "FeatureGroup": "Feature Group 2",
                "FeatureDataType": "numeric",
                "TableName": "Table 2"
            }
        ];
    } else if (_id == 3) {
        features = [{
                "FeatureID": 34,
                "FeatureName": "Feature 11",
                "FeatureDescription": "Feature 11 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            },
            {
                "FeatureID": 35,
                "FeatureName": "Feature 12",
                "FeatureDescription": "Feature 12 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 3"
            },
            {
                "FeatureID": 36,
                "FeatureName": "Feature 13",
                "FeatureDescription": "Feature 13 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 1"
            },
            {
                "FeatureID": 37,
                "FeatureName": "Feature 14",
                "FeatureDescription": "Feature 14 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 2"
            },
            {
                "FeatureID": 38,
                "FeatureName": "Feature 15",
                "FeatureDescription": "Feature 15 Des",
                "FeatureGroup": "Feature Group 3",
                "FeatureDataType": "numeric",
                "TableName": "Table 2"
            }
        ];
    }

    res.json(features);
});

router.post('/filetypes', (req, res) => {
    let filte_types = [{
            "FileTypeName": "File Type 1",
            "Years": ["2012", "2013", "2014", "2015", "2016", "2017", "2018"]
        },
        {
            "FileTypeName": "File Type 2",
            "Years": ["2012", "2013", "2014", "2016", "2018"]
        },
        {
            "FileTypeName": "File Type 3",
            "Years": ["2016", "2017", "2018"]
        },
        {
            "FileTypeName": "File Type 4",
            "Years": ["2012", "2013", "2014", "2015"]
        }
    ];

    res.json(filte_types);
});

router.post('/assessmentyears', (req, res) => {
    let filte_types = [{
            "Year": "2012",
        },
        {
            "Year": "2013",
        },
        {
            "Year": "2014",
        },
        {
            "Year": "2015",
        },
        {
            "Year": "2016",
        },
        {
            "Year": "2017",
        },
    ];

    res.json(filte_types);
});

router.post('/results_old', (req, res) => {
    const _profileId = req.body.profileId;
    console.log(_profileId);
    let results = [];
    if (_profileId == 1) {
        results = [{
                "taxpayer_id": "23156498",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "787451312",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "489564897",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "321564564",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            }

        ];
    } else if (_profileId == 2) {
        results = [{
                "taxpayer_id": "65465456",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "3132564",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "787451312",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "489564897",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "321564564",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            }

        ];
    } else if (_profileId == 5) {
        results = [{
                "taxpayer_id": "65465456",
                "feature_one": "879123",
                "feature_one_score": "98787.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "822379",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "3132564",
                "feature_one": "2232323",
                "feature_one_score": "77i788.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "23156498",
                "feature_one": "8745645659",
                "feature_one_score": "7123128.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "787451312",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "489564897",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },{
                "taxpayer_id": "65465456",
                "feature_one": "879123",
                "feature_one_score": "98787.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "822379",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "3132564",
                "feature_one": "2232323",
                "feature_one_score": "77i788.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "23156498",
                "feature_one": "8745645659",
                "feature_one_score": "7123128.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "787451312",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "489564897",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },{
                "taxpayer_id": "65465456",
                "feature_one": "879123",
                "feature_one_score": "98787.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "822379",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "3132564",
                "feature_one": "2232323",
                "feature_one_score": "77i788.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "23156498",
                "feature_one": "8745645659",
                "feature_one_score": "7123128.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "787451312",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            },
            {
                "taxpayer_id": "489564897",
                "feature_one": "879",
                "feature_one_score": "78.5",
                "feature_one_rank": "2",
                "feature_one_year_one": "888",
                "feature_one_year_two": "850",
                "feature_two": "879",
                "feature_two_score": "78.5",
                "feature_two_rank": "2",
                "feature_two_year_one": "888",
                "feature_two_year_two": "850",
                "feature_three": "879",
                "feature_three_score": "78.5",
                "feature_three_rank": "2",
                "feature_three_year_one": "888",
                "feature_three_year_two": "850",
                "feature_four": "879",
                "feature_four_score": "78.5",
                "feature_four_rank": "2",
                "feature_four_year_one": "888",
                "feature_four_year_two": "850",
                "year": "2018"
            }
        ];
    }

    res.status(200).send(results);
});

router.post('/saveprofile', (req, res) => {
    let profile = req.body;
    console.log(profile);
    profile['ProfileID'] = "2";
    res.status(200).send(profile);
});



module.exports = router;