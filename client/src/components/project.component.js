import Vue from 'vue';

Vue.component('project', {
    data: function () {
        return {

            isLoading: false,
            isError: false,
            isSuccess: false
        }
    },
    methods: {

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
    props: ['project', 'reportDate'],

    render() {
        const { project } = this;

        const { name, key, email } = project;

        const downloadFile = () => {
            this.isLoading = true;
            return project
                .downloadFile(this.reportDate)
                .then(this.notifySuccess)
                .catch(this.notifyError)
                .finally(() => {
                    this.isLoading = false;
                });
        }

        const postProject = () => {
            this.isLoading = true;
            return project
                .postProject(this.reportDate)
                .then(this.notifySuccess)
                .catch(this.notifyError)
                .finally(() => {
                    this.isLoading = false;
                });
        }

        return <div class="project">
            <div>
                <span>{key}</span>
                \
                <span>{name}</span>

            </div>
            <span>{email}</span>
            <div class="actions">
                <span v-show={this.isLoading} class="fas fa-spinner">                                </span>
                <span v-show={this.isError} class="fas fa-exclamation">      הפעולה נכשלה               </span>
                <span v-show={this.isSuccess} >      <i class="fas fa-check"></i>           </span>


                <button class="btn btn-link" onClick={downloadFile}> <i class="fas fa-arrow-down"></i></button>
                <button class="btn btn-link" disabled={email ? null : 'disabled'} onClick={postProject}>  <i class="fas fa-envelope"></i></button>
            </div>
        </div >
    }
})