import Joi from 'joi';
import FinishedReportModel from './finishedReport.model'



export default class ProjectFinishedReportModel extends FinishedReportModel {
    constructor(data) {
        const { project } = data;

        super(data);

        this.project = project;

    }

}