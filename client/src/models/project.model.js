export default class Project {

    constructor(project, serviceProvider) {

        const { key, name, organizaitionKey, email } = project;
        Object.assign(this, { key, name, organizaitionKey, email });

        this._serviceProvider = serviceProvider;
    }

    downloadFile(reportDate) {
        return this._serviceProvider
            .getProjectReportFile(this.organizaitionKey, this.key, reportDate);
    }

    postProject(reportDate) {
        return this._serviceProvider
            .sendProjectReportFile(this.organizaitionKey, this.key, reportDate);
    }

}