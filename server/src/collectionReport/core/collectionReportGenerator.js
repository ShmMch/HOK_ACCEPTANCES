

import pdfReportConfig from '../../resources/collectionReport/pdfConfig'
import { createPdf } from '../../common/pdfCreator';
import { createHtml } from '../../common/htmlCreator';
import path from 'path';


import dateForamt from 'dateFormat'
import CollectionReader from '../../dataAccess/collectionReader';
import ProgramReader from '../../dataAccess/programReader';
import CustomerReader from '../../dataAccess/customerReader';
import CollectionReportModel from '../models/collectionReport.model';
import CollectionReportRecordModel from '../models/collectionReportRecord.model'

export default class CollectionReportGenerator {

    constructor(organization, date, dollarRate) {

        this.collectionReader = new CollectionReader(organization.key, date);
        this.programReader = new ProgramReader(organization.key);
        this.customerReader = new CustomerReader(organization.key);

        this.organization = organization;
        this.date = date;
        this.dollarRate = dollarRate;
    }

    _mapRecord(record) {

        const { programKey, bankAccount, lastName, firstName, closeDate, openDate, city, street, phone, projectKey, sum } = record;
        return new CollectionReportRecordModel({
            projectKey
            , programNo: programKey
            , account: bankAccount
            , name: lastName + ' ' + firstName
            , endDate: closeDate
            , sum: sum.toFixed(2)// (sumShekel + sumDollar * this.dollarRate).toFixed(2)
            , startDate: openDate
            , city
            , address: street
            , telephone: phone

        });
    }

    getReportData() {
        const getCollectionPromise = this.collectionReader.getPrograms();
        const getCustomersPromise = this.customerReader.getCustomers();
        const getProgramsPromise = this.programReader.getPrograms();


        return Promise.all([getCollectionPromise, getCustomersPromise, getProgramsPromise])
            .then(([collectionData, customers, programs]) => {
                return collectionData.map(collectionRecord => {
                    const program = programs.find(program => program.key === collectionRecord.programKey);
                    const customer = customers.find(customer => customer.key === program.customerKey);
                    return Object.assign({}, program, customer, collectionRecord);
                });
            })
            .then(reportRecords => {
                const _records = reportRecords.map(record => this._mapRecord(record));
                return new CollectionReportModel({
                    organization: {
                        name: this.organization.name
                        , address: this.organization.address
                    }
                    , dollarRate: this.dollarRate
                    , day: dateForamt(new Date(this.date), "dd")
                    , month: dateForamt(new Date(this.date), "mmmm yyyy")
                    , records: _records
                    , sum: _records.reduce((sum, record) => sum + parseFloat(record.sum), 0).toFixed(2)
                })

            });
    }

    getReportBytes() {
        return this.getReportData()
            .then(data => createHtml(data, path.join(path.dirname(process.mainModule.filename), 'resources/collectionReport/template.html')))
            .then(html => createPdf(html, pdfReportConfig()));
    }
}
