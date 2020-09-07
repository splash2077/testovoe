<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row justify="center">
          <!-- projects -->
          <v-data-table
            :headers="headersProject"
            :items="projects"
            :expanded.sync="expanded"
            :headers-length="4"
            hide-default-header
            item-key="name"
            show-expand
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Projects Table</v-toolbar-title>
              </v-toolbar>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row v-for="user in item.users" :key="user.id">
                  <v-col cols="3">{{ "User " + user.id }}</v-col>
                  <v-col cols="12" sm="3">
                    <permissions-check-box :chmod="user.chmod" @rwx="user.chmod = $event"></permissions-check-box>
                  </v-col>
                  <v-col cols="12">
                    <v-divider :inset="false"></v-divider>
                  </v-col>
                </v-row>
              </td>
            </template>

            <template v-slot:item.rwx>r-w-x</template>

            <template v-slot:item.active="{ item }">{{ item.activity ? "active" : "noactive" }}</template>

            <template v-slot:item.data-table-expand=" {expand, isExpanded} ">
              <v-btn @click="expand(!isExpanded)">details</v-btn>
            </template>
          </v-data-table>
        </v-row>
      </v-col>

      <!-- users -->
      <v-col cols="12">
        <v-row justify="center">
          <v-data-table
            :headers="headersUser"
            :items="users"
            :expanded.sync="expandedUsers"
            hide-default-header
            item-key="id"
            show-expand
            class="elevation-1"
            calculate-widths
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Users Table</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="info()">Add User</v-btn>
              </v-toolbar>
            </template>

            <template v-slot:item.id="{ item }">{{"User " + item.id}}</template>

            <template v-slot:item.rwx>r-w-x</template>

            <template v-slot:item.info="{ item }">
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ "User " + viewedUser.id }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field disabled v-model="viewedUser.id" label="id"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field disabled v-model="viewedUser.email" label="email"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field disabled v-model="viewedUser.last_login" label="last login"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field disabled v-model="viewedUser.banned" label="banned"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn @click="viewUser(item)">info</v-btn>
            </template>

            <template v-slot:item.data-table-expand="{ expand, isExpanded }">
              <v-btn @click="expand(!isExpanded)">details</v-btn>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row v-for="project in usersProjects[item.id]" :key="project.id">
                  <v-col cols="3">{{ project.name }}</v-col>

                  <v-col cols="3" sm="6" md="4">
                    <permissions-check-box
                      :chmod="getUserPermission(project, item.id).chmod"
                      @rwx="getUserPermission(project, item.id).chmod = $event"
                    ></permissions-check-box>
                  </v-col>

                  <v-col cols="12">
                    <v-divider :inset="false"></v-divider>
                  </v-col>
                </v-row>
              </td>
            </template>
          </v-data-table>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
import permissionsCheckBox from "@/components/PermissionsCheckBox";
export default {
  name: "BankProfile",
  components: {
    permissionsCheckBox,
  },

  data: () => ({
    dialog: false,
    viewedUser: {
      id: "",
      email: "",
      last_login: "",
      banned: "",
    },
    expanded: [],
    expandedUsers: [],

    headersProject: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "rwx", value: "rwx" },
      { text: "activity", value: "active", align: "end" },
      { text: "", value: "data-table-expand", align: "end" },
    ],
    headersUser: [
      {
        text: "id",
        align: "start",
        sortable: false,
        value: "id",
        width: "50%",
      },
      { text: "rwx", value: "rwx" },
      { text: "info", value: "info", align: "end" },
      { text: "", value: "data-table-expand", align: "end" },
    ],
  }),

  computed: {
    usersProjects() {
      let usersProjects = {};
      for (let x of this.projects) {
        for (let user of x.users) {
          if (!Array.isArray(usersProjects[user.id])) {
            usersProjects[user.id] = [];
          }
          usersProjects[user.id].push(x);
        }
      }
      return usersProjects;
    },

    ...mapState(["projects", "users"]),
  },

  created() {
    this.$store.commit("INITIALIZE");
  },

  methods: {
    info() {
      console.info("new user");
    },

    viewUser(user) {
      this.viewedUser = Object.assign({}, user);
      this.dialog = true;
    },

    getUserPermission(arr, id) {
      let chmodUser = {};
      for (let user of arr.users) {
        if (user.id === id) {
          chmodUser = user;
          break;
        }
      }
      return chmodUser;
    },
  },
};
</script>
 
 <style scoped>
.v-data-table {
  width: 900px;
}
</style>