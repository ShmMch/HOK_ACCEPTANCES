import express from 'express';
import FinishedReportService from './services/finishedReport.service'
import ProjectFinishedReportService from './services/projectFinishedReport.service'

const createReportRouter = function (app) {
    const reportRouter = express.Router();
    const _finishedReportService = new FinishedReportService();
    const _projectFinishedReportService = new ProjectFinishedReportService();



    reportRouter.route('/api/organization')
        .get(function (req, res, next) {
            var { date } = req.query;
            _finishedReportService.getReportOrganizations(date)
                .then(data => res.send(data))
                .catch(next);
        });

    reportRouter.route('/api/:organizationKey/projects')
        .get(function (req, res, next) {
            const { organizationKey } = req.params;
            _projectFinishedReportService.getOrganizationProjects(organizationKey)
                .then(data => res.send(data))
                .catch(next);
        });


    reportRouter.route('/api/:organizationKey')
        .get(function (req, res, next) {
            const { organizationKey } = req.params,
                { date } = req.query;
            _finishedReportService.getReportFile(organizationKey, date)
                .then(data => res.send(data))
                .catch(next);
        });

    reportRouter.route('/api/:organizationKey/:projectKey')
        .get(function (req, res, next) {
            const { organizationKey, projectKey } = req.params,
                { date } = req.query;
            _projectFinishedReportService.getReportFile(organizationKey, projectKey, date)
                .then(data => res.send(data))
                .catch(next);
        });

    reportRouter.route('/api/:organizationKey/:projectKey')
        .post(function (req, res, next) {
            const { organizationKey, projectKey } = req.params,
                { date } = req.query;
            _projectFinishedReportService.postReportFile(organizationKey, projectKey, date)
                .then(data => res.send(data))
                .catch(next);
        });


    reportRouter.route('/api/:organizationKey')
        .post(function (req, res, next) {
            const { organizationKey } = req.params,
                { date } = req.query;
            _finishedReportService.postReportFile(organizationKey, date)
                .then(data => res.send(data))
                .catch(next);
        });

 
    reportRouter.route('/')
        .get(function (req, res, next) {
            req.url = '/finishedReport.html';
            app.handle(req, res, next);


        });
    return reportRouter;
}

export default createReportRouter;