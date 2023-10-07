<template>
    <div class="panelbox">
        <left-pannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname"></left-pannel>
        <div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
            <div class="header">
                <common-header v-if="type == 'admin'" title="Edit Staff" :name="this.$store.state.user.name" ></common-header>
                <staff-header v-else title="Edit Staff"></staff-header>
            </div>
            <div class='loaderbox'  v-if="!this.id">
                <img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
            </div>
            <div class="content-page admin-new-editstaff-page">
                <div class="fullrow">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="back-button-setup">
                                <router-link :to="{ name: 'StaffList' }">
                                    <img src="../../assets/images/back-left-arrow.png" alt="&laquo;"/>Back
                                </router-link>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="edit-staff-head-save">
                                <input type="submit" class="yellow-button" name="editSave" value="Save" @click="editStaff" />
                            </div>
                        </div>                                
                        <div class="col-12">
                            <div class="common-white-shadow-background">
                                <div class="edit-staff-data-form">
                                    <form class="form-box row" @submit.prevent enctype="multipart/form-data">
                                        <div class="col-12">
                                            <input type="text" name="editname" v-model="name" placeholder="Name" :class="[errors.name ? 'invalid-class' : '']" required />
                                            <p style="color: red">{{ errors.name }}</p>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="email" name="editemail" v-model="email" placeholder="Email" :class="[errors.email ? 'invalid-class' : '']" readonly />
                                            <p style="color: red">{{ errors.email }}</p>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="tel" name="editphone" v-model="phone" placeholder="Phone Number" :class="[errors.phone ? 'invalid-class' : '']" required />
                                            <p style="color: red">{{ errors.phone }}</p>
                                        </div>
                                        <div class="col-12 editstaff-address">
                                            <textarea name="editaddress" v-model="address" placeholder="Address" rows="3" :class="[errors.address ? 'invalid-class' : '']" required></textarea>
                                            <p style="color: red">{{ errors.address }}</p>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="myphoto">Photo</label>
                                            <input type="file" id="photo" name="myphoto" key="photo" ref="photo" @change="onPhoto" />
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="mydoc1">Document 1</label>
                                            <input type="file" id="mydoc1" name="mydoc1" ref="doc1" key="doc1" @change="onDoc1" />
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="mydoc2">Document 2</label>
                                            <input type="file" id="mydoc2" name="mydoc2" ref="doc2" key="doc2" @change="onDoc2" />
                                        </div>  
                                        <div class="col-sm-4">
                                            <label for="mydoc3">Document 3</label>
                                            <input type="file" id="mydoc3" name="mydoc3" ref="doc3" key="doc3" @change="onDoc3" />
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="mydoc4">Document 4</label>
                                            <input type="file" id="mydoc4" name="mydoc4" ref="doc4" key="doc4" @change="onDoc4" />
                                        </div>
                                        <div class="col-12 editstaff-notes">
                                            <textarea name="editnote" v-model="note" rows="3" placeholder="Note" ></textarea>
                                            <p></p>
                                        </div>
                                        <div class="col-12">
                                            <label for="permission">Permissions</label>
                                        </div>
                                        <p></p>
                                        <div class="col-sm-2">Attendance</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="AttendanceList" />
                                        </div>
                                        <div class="col-sm-2">Clients</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="clients" />
                                        </div>
                                        <div class="col-sm-2">Invoices</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="invoice" />
                                        </div>
                                        <div class="col-sm-2">Projects</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="projects" />
                                        </div>
                                        <div class="col-sm-2">Track</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="TrackList" />
                                        </div>
                                        <div class="col-sm-2">Staff</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="StaffList" />
                                        </div>
                                        <div class="col-sm-2">Leave</div>
                                        <div class="col-sm-2">
                                            <input type="checkbox" v-model="checked" value="leave" />
                                        </div>
                                        <p></p>
                                        <div class="col-12">
                                            <input type="submit" value="Save" class="yellow-button" @click="editStaff" />
                                        </div>
                                    </form>
                                </div>
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
import StaffHeader from "../../components/user/CommonHeader.vue";
import base_url from "../../base_url.js";

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
            id: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            note: "",
            photo: "",
            supportphoto: "",
            doc1: "",
            supportdoc1: "",
            doc2: "",
            supportdoc2: "",
            doc3: "",
            supportdoc3: "",
            doc4: "",
            supportdoc4: "",
            errors: [],
            checked: [],
            permissions: [],
            admin_id: "",
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

        axios.post(`${base_url}/user`, {
            headers: { token: localStorage.getItem("token") },
            type: localStorage.getItem("type"),
        }).then((res) => {
            this.$store.state.user = res.data.user;
            this.singleStaffSelect();
        });
    },
    methods: {
        onPhoto() {
            const photo = this.$refs.photo.files[0];
            this.photo = photo;
        },
        onDoc1() {
            const doc1 = this.$refs.doc1.files[0];
            this.doc1 = doc1;
        },
        onDoc2() {
            const doc2 = this.$refs.doc2.files[0];
            this.doc2 = doc2;
        },
        onDoc3() {
            const doc3 = this.$refs.doc3.files[0];
            this.doc3 = doc3;
        },
        onDoc4() {
            const doc4 = this.$refs.doc4.files[0];
            this.doc4 = doc4;
        },
        async singleStaffSelect() {
            const response = await axios.get(`${base_url}/staff/${this.$route.params.id}`);
            this.name = response.data.name;
            this.email = response.data.email;
            this.phone = response.data.phone;
            this.address = response.data.address;
            this.note = response.data.note;
            this.photo = response.data.photo;
            this.doc1 = response.data.doc1;
            this.doc2 = response.data.doc2;
            this.doc3 = response.data.doc3;
            this.doc4 = response.data.doc4;
            this.id = response.data.id;
            await axios.post(`${base_url}/get_permission`, {
                headers: { token: localStorage.getItem("token") },
                type: localStorage.getItem("type"),
                id: this.id,
                admin_id: this.$store.state.user.id,
            }).then((res) => {
                this.permissions = JSON.parse(res.data.permission);
                this.checked = this.permissions;
                console.log(this.checked);
            });
        },
        async editStaff() {
            this.errors = [];

            if (!this.name) {
                this.errors["name"] = "Name is Required";
            }
            if (!this.email) {
                this.errors["email"] = "Email is Required";
            } else if (!this.validEmail(this.email)) {
                this.errors["email"] = "Please enter valid email address";
            }
            if (this.phone.length === 0) {
                this.errors["phone"] = "Phone Number is Required";
            } else if (!this.validPhone(this.phone)) {
                this.errors["phone"] = "Please enter valid phone number";
            }     
            if (!this.address) {
                this.errors["address"] = "address is Required";
            }

            if ( !this.errors["name"] && !this.errors["email"] && !this.errors["phone"] && !this.errors["address"]) {
                const formData = new FormData();
                formData.append("photo", this.photo);
                formData.append("doc1", this.doc1);
                formData.append("doc2", this.doc2);
                formData.append("doc3", this.doc3);
                formData.append("doc4", this.doc4);
                await axios.post(`${base_url}/upload/${this.id}`, formData).then((res) => {
                    this.supportphoto = this.supportdoc1 = this.supportdoc2 = this.supportdoc3 = this.supportdoc4 = "";
                    if (res.data.files.photo) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }           
                    if (res.data.files.doc1) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.doc2) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.doc3) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }           
                    if (res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }           
                    if (res.data.files.photo && res.data.files.doc1) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.photo && res.data.files.doc2) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.photo && res.data.files.doc3) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.photo && res.data.files.doc4) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if (res.data.files.doc1 && res.data.files.doc2) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }           
                    if (res.data.files.doc1 && res.data.files.doc3) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.doc1 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if (res.data.files.doc2 && res.data.files.doc3) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if (res.data.files.doc2 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if (res.data.files.doc3 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc2;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc2) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = this.doc4;
                    }
                    if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc3) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc4) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.photo && res.data.files.doc2 && res.data.files.doc3) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if ( res.data.files.photo && res.data.files.doc2 && res.data.files.doc4) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.photo && res.data.files.doc3 && res.data.files.doc4) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc3 ) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = this.doc4;
                    }
                    if ( res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = this.doc3;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.doc1 && res.data.files.doc3 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = this.doc2;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.doc2 && res.data.files.doc3 && res.data.files.doc4) {
                        this.supportphoto = this.photo;
                        this.supportdoc1 = this.doc1;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc3 && res.data.files.doc4) {
                        this.supportphoto = res.data.files.photo[0].filename;
                        this.supportdoc1 = res.data.files.doc1[0].filename;
                        this.supportdoc2 = res.data.files.doc2[0].filename;
                        this.supportdoc3 = res.data.files.doc3[0].filename;
                        this.supportdoc4 = res.data.files.doc4[0].filename;
                    }
                    axios.post(`${base_url}/staff/${this.id}`, {
                        name: this.name,
                        email: this.email,
                        phone: this.phone,
                        address: this.address,
                        note: this.note,
                        photo: this.supportphoto,
                        doc1: this.supportdoc1,
                        doc2: this.supportdoc2,
                        doc3: this.supportdoc3,
                        doc4: this.supportdoc4,
                    });
                    this.$router.push({ name: "StaffList" });
                    this.$notify({
                        title: "<b>Staff</b> updated successfully!",
                        type: "warn",
                    });
                    this.permission();
                });
            }
        },
        async permission() {
            await axios.post(`${base_url}/permission`, {
                permission: JSON.stringify(this.checked),
                staff_id: this.id,
                admin_id: this.$store.state.user.id,
            });
        },
        validEmail: function (email) {
            var re =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validPhone: function (mobile) {
            var phone = /^(\+\d{1,3}[- ]?)?\d{10}$/;
            return phone.test(mobile);
        },
    },
};
</script>

<style></style>
