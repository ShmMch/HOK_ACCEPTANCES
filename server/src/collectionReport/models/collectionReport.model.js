import Joi from 'joi';
import { CollectionReportRecordSchema } from './collectionReportRecord.model';

const schema = {
    organization: Joi.object({
        name: Joi.string().required(),
        address: Joi.optional()
    }),
    dollarRate: Joi.number().required(),
    day: Joi.string().required(),
    month: Joi.string().required(),
    records: Joi.array().items(CollectionReportRecordSchema),
    sum: Joi.number()
};

export default class CollectionReportModel {
    constructor(data) {

        Joi.validate(data, schema, function (err, value) {
            if (err) console.log(err);
        });

        const { organization, dollarRate, day, month, records, sum } = data;
        this.organization = organization;
        this.dollarRate = dollarRate;
        this.day = day;
        this.month = month;
        this.records = records.sort((preRec, rec) => preRec.name.localeCompare(rec.name));
        this.sum = sum;

    }

}