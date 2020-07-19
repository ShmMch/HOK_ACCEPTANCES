import Vue from 'vue';

import './project.component'

Vue.component('organization', {
    data: function () {
        return {
            isOpenProjects: false,
            isLoading: false,
            isError: false,
            isSuccess: false
        }
    },
    methods: {
        toggleProjects() {
            this.isOpenProjects = !this.isOpenProjects;
        },
        notifySuccess() {
            this.isSuccess = true;
            setTimeout(() => {
                this.isSuccess = false;
            }, 2000);
        },
        notifyError() {
            this.isError = true;
            setTimeout(() => {
                this.isError = false;
            }, 2000);
        }
    },
    props: ['organization', 'reportDate'],
    render() {
        const { organization } = this;
        const { name, projects, email } = organization;
        const downloadFile = () => {
            this.isLoading = true;
            return organization
                .downloadFile(this.reportDate)
                .then(this.notifySuccess)
                .catch(this.notifyError)
                .finally(() => {
                    this.isLoading = false;
                });
        }

        const sendEmail = () => {
            this.isLoading = true;
            return organization
                .sendEmail(this.reportDate)
                .then(this.notifySuccess)
                .catch(this.notifyError)
                .finally(() => {
                    this.isLoading = false;
                });
        }
        return <div>

            <div class="organization">
                <div>
                    <button class="btn btn-link" onClick={this.toggleProjects} v-show={!this.isOpenProjects} disabled={projects.length ? null : 'disabled'}>  <i class="fas fa-angle-down"></i></button>
                    <button class="btn btn-link" onClick={this.toggleProjects} v-show={this.isOpenProjects} disabled={projects.length ? null : 'disabled'}>  <i class="fas fa-angle-left"></i></button>
                </div>
                <div>
                    <span>{name}</span>
                </div>
                <div>
                    <span>{email}</span>
                </div>

                <div class="actions">
                    <span v-show={this.isLoading} class="fas fa-spinner">                                </span>
                    <span v-show={this.isError} class="fas fa-exclamation">      הפעולה נכשלה               </span>
                    <span v-show={this.isSuccess} >      <i class="fas fa-check"></i>           </span>

                    <button class="btn btn-link" onClick={downloadFile}> <i class="fas fa-arrow-down"></i></button>
                    <button class="btn btn-link" onClick={sendEmail} disabled={email ? null : 'disabled'}>  <i class="fas fa-envelope"></i></button>
                </div>
            </div>
            <div v-show={this.isOpenProjects}>
                {projects.map(prj => <project project={prj} reportDate={this.reportDate} />)}
            </div>
        </div>
    }
})