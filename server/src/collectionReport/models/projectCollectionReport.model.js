import Joi from 'joi';
import CollectionReportModel, { schema } from './collectionReport.model'


export default class ProjectCollectionReportModel extends CollectionReportModel {
    constructor(data) {
        const { project } = data;

        super(data);

        this.project = project;

    }

}