import Vue from 'vue';

Vue.component('date-picker', {
    data: function () {
        return {
            date: '2018-01-01'
        }
    },

    props: ['change'],

    render() {
        return <form onSubmit: prevent={() => this.change(this.date)} >
            <div class="input-group mb-3 col-sm-4">
                <input v-model={this.date} type="date" required class="form-control" />
                <div class="input-group-append">
                    <button type="submit" class="btn btn-outline-secondary" >   <i class="fas fa-angle-left"></i>  </button>
                </div>
            </div>
        </form >

    }

})