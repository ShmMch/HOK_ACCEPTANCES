import Joi from 'joi';
import { FinishedReportRecordSchema } from './finishedReportRecord.model';

const schema = {
    organization: Joi.object({
        name: Joi.string().required(),
        address: Joi.optional()
    }),
    day: Joi.string().required(),
    month: Joi.string().required(),
    records: Joi.array().items(FinishedReportRecordSchema),
    sum: Joi.number()
};

export default class FinishedReportRecordModel {
    constructor(data) {

        Joi.validate(data, schema, function (err, value) {
            if (err) console.log(err);
        });

        const { organization, day, month, records, sum } = data;
        this.organization = organization;
        this.day = day;
        this.month = month;
        this.records = records.sort((preRec, rec) => preRec.name.localeCompare(rec.name));
        this.sum = sum;

    }

}