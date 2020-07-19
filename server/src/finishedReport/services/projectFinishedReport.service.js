

import nodemailer from 'nodemailer';

import ProjectFinishedReportGenerator from '../core/projectFinishedReportGenerator';
import OrganizationReader from '../../dataAccess/organizationReader';
import FeeReader from '../../dataAccess/feeReader';
import ProjectReader from '../../dataAccess/projectReader';

export default class ProjectFinishedReportService {
    constructor() {
        this.feeReader = new FeeReader();
        this.organizationReader = new OrganizationReader();
        const { MAILADDRESS: mailAddress, MAILPASS: mailPassword } = process.env;
        this.transporter = nodemailer.createTransport(`smtp://${mailAddress}:${mailPassword}@smtp.gmail.com`);

    }

    postReportFile(organizationKey, projectKey, date) {
        const getReportPromise = this.getReportFile(organizationKey, projectKey, date);
        const getProjectPromise = new ProjectReader(organizationKey).getProject(projectKey);


        return Promise.all([getProjectPromise, getReportPromise])

            .then(([project, file] = data) => {              
                return this.transporter.sendMail({
                    from: '"שירותי מחשב" <aa@gmail.com>',
                    to: project.email,
                    subject: `${project.name} - דוח מסיימים ליום ${date}`,
                    body: 'mail content...',
                    attachments: [{ filename: file.fileName, content: file.content }]
                });
            })

    }

    getReportFile(organizationKey, projectKey, date) {
        const getOrganizationPromise = this.organizationReader.getOrganization(organizationKey);
        const getProjectPromise = new ProjectReader(organizationKey).getProject(projectKey);

        return Promise.all([getOrganizationPromise, getProjectPromise])
            .then(([organization, project]) => this.feeReader.getCompanyFee(organization.code, date).then(fee => {
                const finishedReportGenerator = new ProjectFinishedReportGenerator(organization, project, date, fee.dollarRate);              
                return Promise.all([organization, finishedReportGenerator.getReportBytes()]);
            })).then(([organization, fileContent]) => {
                 return { fileName: `${organization.name}_${projectKey} - מסיימים ${date}.pdf`, content: fileContent }
            });
    }

    getOrganizationProjects(organizationKey) {
        const projectReader = new ProjectReader(organizationKey);
        return projectReader.getProjects();
    };
}