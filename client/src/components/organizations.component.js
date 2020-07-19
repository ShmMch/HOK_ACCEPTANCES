import Vue from 'vue';
import './organization.component'

Vue.component('organizations', {
  data: function () {
    return {
      count: 0
    }
  },
  props: ['organizations', 'reportDate'],
  render() {
    const { organizations } = this;
    return <div>
      {organizations.map(org => <organization organization={org} reportDate={this.reportDate} />)}
    </div>
  }
})