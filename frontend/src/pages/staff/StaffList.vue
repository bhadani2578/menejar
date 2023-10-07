<template>
  <div class="panelbox">
    <LeftPannel
      :image="this.$store.state.user.image"
      :cname="this.$store.state.user.cname"
    />
    <div
      :class="
        type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'
      "
    >
      <div class="header">
        <CommonHeader
          v-if="type == 'admin'"
          title="Staff"
          :name="this.$store.state.user.name"
        />
        <staff-header v-else title="Staff Listing"></staff-header>
      </div>
      <div class="loaderbox" v-if="this.items.length < 0">
        <img
          style="width: 100px"
          src="../../assets/images/Loading-bar.gif"
          alt="&laquo;"
        />
      </div>
      <div class="content-page admin-attendance-page">
        <div class="fullrow">
          <div class="row admin-staff-list-toppart">
            <div class="col-md-4">
              <input
                class="search-leave satff-listing-page-search"
                type="text"
                name="search"
                v-model="filter.name"
                placeholder="Search Staff"
              />
            </div>
            <div class="col-md-4">
              <input
                type="submit"
                value="Submit"
                class="yellow-button"
                @click="filterSearch"
              />
              <input
                type="submit"
                value="Clear"
                class="yellow-button"
                v-if="filter.is_filter == 1"
                @click="removeSearch"
              />
            </div>
            <div class="col-md-4">
              <div class="addnew-button">
                <router-link :to="{ name: 'AddStaff' }"
                  ><span>
                    <img
                      src="../../assets/images/plus-icon.png"
                      alt="Add Track" /></span
                  >Add New
                </router-link>
              </div>
            </div>
          </div>
          <div v-if="filter.is_filter == 1">
            Showing {{ this.result_length }} on {{ this.pages.length }} page
          </div>
          <div class="col-md-12 page-dropdown">
            <select
              class="select-dropdown"
              v-model="pageSize"
              @change="pageChange($event)"
            >
              <option value="50">50</option>
              <option value="30">30</option>
              <option value="20">20</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div
              class="fullwidth-table track-table-body attendance-admin-table-body"
            >
              <table>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Activaion</th>
                  <th>Actions</th>
                </tr>
                <tr v-for="(item, index) in items" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.phone }}</td>
                  <td>
                    <div
                      :class="
                        item.is_active == 1
                          ? 'toggle-switch checked'
                          : 'toggle-switch'
                      "
                      @click="toggle(item.is_active, item.id)"
                    >
                      <div class="toggle-handle"></div>
                    </div>
                  </td>
                  <td>
                    <ul>
                      <li>
                        <router-link
                          :to="{ name: 'ViewStaff', params: { id: item.id } }"
                        >
                          <img
                            src="../../assets/images/visibility.png"
                            alt="Delete"
                          />
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          :to="{ name: 'EditStaff', params: { id: item.id } }"
                          ><img src="../../assets/images/pen.png" alt="Edit"
                        /></router-link>
                      </li>
                      <li>
                        <a @click="deleteStaff(item.id)">
                          <img
                            src="../../assets/images/delete.png"
                            alt="Delete"
                          />
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <!-- Pagination -->
          <div class="col-12">
            <div class="admininvoice-pagination">
              <div v-if="filter.is_filter == 0" class="pagination">
                <a v-if="page != 1" @click="prevPage"
                  ><img src="../../assets/images/pagi-left.png" alt="&laquo;"
                /></a>
                <a
                  :class="pageNumber == page ? 'active' : ''"
                  v-for="pageNumber in pages.slice(page - 1, page + 2)"
                  :key="pageNumber"
                  @click="pageCount(pageNumber)"
                >
                  {{ pageNumber }}
                </a>
                <a @click="nextPage" v-if="page < pages.length">
                  <img src="../../assets/images/pagi-right.png" alt="&raquo;" />
                </a>
              </div>
              <div v-else class="pagination">
                <a v-if="page != 1" @click="prevPages"
                  ><img src="../../assets/images/pagi-left.png" alt="&laquo;"
                /></a>
                <a
                  :class="pageNumber == page ? 'active' : ''"
                  v-for="pageNumber in pages.slice(page - 1, page + 2)"
                  :key="pageNumber"
                  @click="pageCounts(pageNumber)"
                >
                  {{ pageNumber }}
                </a>
                <a @click="nextPages" v-if="page < pages.length"
                  ><img src="../../assets/images/pagi-right.png" alt="&raquo;"
                /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LeftPannel from "../../components/admin/LeftPannel.vue";
import CommonHeader from "../../components/admin/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import base_url from "../../base_url.js";
import StaffHeader from "../../components/user/CommonHeader.vue";

const $ = require("jquery");
window.$ = $;

export default {
  components: {
    LeftPannel,
    CommonHeader,
    CommonFooter,
    StaffHeader,
  },
  data() {
    return {
      type: "",
      name: "",
      items: [],
      page: 1,
      filter_page: 1,
      result_length: "",
      perPage: 50,
      pageSize: 50,
      pages: [],
      filter: {
        name: "",
        is_filter: 0,
      },
      value: 0,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (localStorage.getItem("type") == "staff") {
      if (localStorage.getItem("permission").includes("StaffList")) {
        next();
      } else {
        next({ name: "staff_dashboard" });
      }
    } else {
      next();
    }
  },
  created() {
    this.type = localStorage.getItem("type");

    axios
      .post(`${base_url}/user`, {
        headers: { token: localStorage.getItem("token") },
        type: localStorage.getItem("type"),
      })
      .then((res) => {
        this.$store.state.user = res.data.user;
        if (localStorage.getItem("StaffListFilter")) {
          var name = JSON.parse(localStorage.getItem("StaffListFilter"))[
            "name"
          ];
          this.filter.name = name;
          this.filterSearch();
        } else {
          this.showStaffList();
        }
        if (this.$store.state.user.is_business == 1) {
          this.$router.push("/stafflist");
        } else {
          this.$router.push("/business_setting");
        }
      });
  },
  watch: {
    items() {
      this.setPages();
    },
  },
  methods: {
    async filterSearch() {
      var filter = { name: this.filter.name };
      localStorage.setItem("StaffListFilter", [JSON.stringify(filter)]);
      const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      await axios
        .post(`${base_url}/staff_search` + params, {
          name: this.filter.name,
          admin_id: this.$store.state.user.id,
        })
        .then((res) => {
          this.items = res.data.results;
          this.page = res.data.page;
          this.result_length = res.data.length.length;
          this.filter.is_filter = 1;
        });
    },
    async removeSearch() {
      this.filter_page = 1;
      this.filter.name = "";
      const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      await axios
        .post(`${base_url}/staff_search` + params, {
          name: this.filter.name,
          admin_id: this.$store.state.user.id,
        })
        .then((res) => {
          localStorage.removeItem("StaffListFilter");
          this.items = res.data.results;
          this.page = res.data.page;
          this.result_length = res.data.length.length;
          this.filter_page = 1;
          this.filter.is_filter = 0;
        });
    },
    async showStaffList() {
      const params = "?pages=" + this.page + "&size=" + this.pageSize;
      const response = await axios.post(`${base_url}/get_stafflist` + params, {
        admin_id: this.$store.state.user.id,
      });
      this.items = response.data.results;
      this.page = response.data.page;
      this.result_length = response.data.length.length;
    },

    //Toggle - Activation
    async toggle(status, id) {
      if (status === 1) {
        await axios.post(`${base_url}/deactivatestaff/${id}`);
        this.showStaffList();
        this.$notify({
          title: "<b>Staff</b> disabled successfully!",
          type: "warn",
        });
      } else {
		await axios.post(`${base_url}/activatestaff/${id}`);
        this.showStaffList();
		    this.$notify({
          title: "<b>Staff</b> enabled successfully!",
          type: "success",
        });
	  }
    },

    async deleteStaff(id) {
      console.log("id frontend::::", id)
      await axios
        .post(`${base_url}/deletestaff/${id}`)
        .then(() => {
          this.showStaffList();
          this.$notify({
            title: "<b>Staff</b> deleted successfully!",
            type: "warn",
          });
        })
    },

    setPages() {
      this.pages = [];
      this.perPage = this.pageSize;
      let numberOfPages = Math.ceil(this.result_length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },

    //page number wise display
    pageCount(pageNumber) {
      $(window).scrollTop(0);
      if (!pageNumber) {
        this.page++;
      }
      this.page = pageNumber;
      this.showStaffList();
    },
    //filter page number
    pageCounts(pageNumber) {
      if (!pageNumber) {
        this.filter_page++;
      }
      this.filter_page = pageNumber;
      this.filterSearch();
    },
    //display prev page
    prevPage() {
      $(window).scrollTop(0);
      this.page--;
      this.showStaffList();
    },
    //filter prev page
    prevPages() {
      this.filter_page--;
      this.filterSearch();
    },
    //display next page
    nextPage() {
      $(window).scrollTop(0);
      this.page++;
      this.showStaffList();
    },
    nextPages() {
      this.filter_page++;
      this.filterSearch();
    },
    //per page change
    pageChange() {
      this.filter_page = 1;
      this.page = 1;
      if (this.filter.is_filter == 1) {
        this.filterSearch();
      } else {
        this.showStaffList();
      }
    },
  },
};
</script>

<style>
.toggle-switch {
  display: inline-block;
  width: 50px;
  height: 30px;
  background-color: #fc4c4c;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
}

.toggle-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #fff;
  transition: transform 0.2s ease;
}

.checked {
  background-color: #2ecc71;
}

.checked .toggle-handle {
  transform: translateX(20px);
}
</style>
