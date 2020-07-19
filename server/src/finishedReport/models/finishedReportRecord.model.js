import Joi from 'joi';
import dateForamt from 'dateFormat';

export const FinishedReportRecordSchema = {
    projectKey: Joi.string().required(),
    programNo: Joi.string().required(),
    account: Joi.string().required(),
    name: Joi.string().required(),
    startDate: Joi.optional(),
    endDate: Joi.optional(),
    sum: Joi.number(),
    telephone: Joi.optional(),
    address: Joi.optional(),
    city: Joi.optional()
};

export default class FinishedReportRecordModel {
    constructor(data) {

        Joi.validate(data, FinishedReportRecordSchema, function (err, value) {
            if (err) console.log(err);
        });

        const { projectKey, programNo, account, name, endDate, sum, startDate, telephone, address, city } = data;
        
        this.projectKey = projectKey;
        this.programNo = programNo.slice(- 5);
        this.account = account;
        this.name = name.slice(0, 15);
        this.startDate = dateForamt(startDate, "mm/yy")
        this.endDate = dateForamt(endDate, "mm/yy")
        this.sum = sum;
        this.city = city;
        this.address = address;
        this.telephone = telephone;




    }

}