import axios from "axios";

export class UserService {
  getUser() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/users", { withCredentials: true })
      .then((res) => res.data.data);
  }
  
  deleteUser(id) {
    axios.defaults.withCredentials = true;
    const urlDelete = `http://localhost:1486/api/admin/users?id=` + String(id);

    return axios.delete(urlDelete);
  }
  saveUser(user) {
    axios.defaults.withCredentials = true;
    return axios.post("http://localhost:1486/api/admin/user", user, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updateUser(user) {
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:8080/api/admin/order", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  uploadImageUser(event) {
    axios.defaults.withCredentials = true;
    let formData = new FormData();
    formData.append("file", event);

    return axios
      .post("http://localhost:8080/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.downloadUri);

        return res.data.downloadUri;
      });
  }
  getUsersWithUsersSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
