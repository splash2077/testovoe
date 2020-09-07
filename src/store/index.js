import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    projects: [],
    users: []
  },
  mutations: {
    INITIALIZE(state) {
      state.projects = [
        {
          id: 1,
          name: "Project name 1",
          active: true,
          users: [
            {
              id: 1,
              chmod: 6,
            },
          ],
        },
        {
          id: 2,
          name: "Project name 2",
          active: true,
          users: [
            {
              id: 1,
              chmod: 5,
            },
            {
              id: 2,
              chmod: 2,
            },
          ],
        },
      ];

      state.users = [
        {
          id: 1,
          email: "email1@mail.com",
          last_login: "12 aug 2019",
          banned: true,
        },
        {
          id: 2,
          email: "emai2l@mail.com",
          last_login: "12 aug 2019",
          banned: false,
        },
      ];
    }
  }
})
