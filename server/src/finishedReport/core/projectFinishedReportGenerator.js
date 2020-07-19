

import pdfReportConfig from '../../resources/finishedReport/pdfConfig';
import { createPdf } from '../../common/pdfCreator';
import { createHtml } from '../../common/htmlCreator';

import path from 'path';

import dateForamt from 'dateFormat'
import CollectionReader from '../../dataAccess/collectionReader';
import ProgramReader from '../../dataAccess/programReader';
import CustomerReader from '../../dataAccess/customerReader';
import ProjectCollectionReportModel from '../models/projectFinishedReport.model';
import FinishedReportRecordModel from '../models/finishedReportRecord.model'

export default class ProjectCollectionReportGenerator {

    constructor(organization, project, date) {

        this.collectionReader = new CollectionReader(organization.key, date);
        this.programReader = new ProgramReader(organization.key);
        this.customerReader = new CustomerReader(organization.key);

        this.organization = organization;
        this.date = date;
        this.project = project;
    }

    _mapRecord(record) {

        const { key, bankAccount, lastName, firstName, closeDate, openDate, city, street, phone, projectKey, sumShekel, sum } = record;
        return new FinishedReportRecordModel({
            projectKey
            , programNo: key
            , account: bankAccount
            , name: lastName + ' ' + firstName
            , endDate: closeDate
            , sum: (sum || sumShekel).toFixed(2)
            , startDate: openDate
            , city
            , address: street
            , telephone: phone

        });
    }

    getReportData() {
        const getCollectionPromise = this.collectionReader.getPrograms();
        const getCustomersPromise = this.customerReader.getCustomers();
        const getProgramsPromise = this.programReader.getFinishedPrograms(this.date);


        return Promise.all([getCollectionPromise, getCustomersPromise, getProgramsPromise])
            .then(([collectionData, customers, programs]) => {
                return programs.map(program => {
                    const collectionRecord = collectionData.find(collectionRecord => program.key === collectionRecord.programKey);
                    const customer = customers.find(customer => customer.key === program.customerKey);
                    return Object.assign({}, program, customer, collectionRecord, { key: program.key });
                });
            })

            .then(reportRecords => {
                const _records = reportRecords
                    .map(record => this._mapRecord(record))
                    .filter(record => record.projectKey === this.project.key);
                return new ProjectCollectionReportModel({
                    organization: {
                        name: this.organization.name
                        , address: this.organization.address
                    }
                    , project: this.project
                    , day: dateForamt(new Date(this.date), "dd")
                    , month: dateForamt(new Date(this.date), "mmmm yyyy")
                    , records: _records
                    , sum: _records.reduce((sum, record) => sum + parseFloat(record.sum), 0).toFixed(2)
                })

            });
    }

    getReportBytes() {
        return this.getReportData()
            .then(data => createHtml(data, path.join(path.dirname(process.mainModule.filename), 'resources/finishedReport/template.html')))
            .then(html => createPdf(html, pdfReportConfig()));
    }
}
