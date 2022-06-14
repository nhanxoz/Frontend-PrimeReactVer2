import axios from "axios";
import { access_token } from "../contexts/constants";
export class UserService {
  getUser() {
        

    return axios
      .get("http://localhost:8080/api/admin/users",{  headers: {
        'Authorization': `Bearer ${access_token}`
      }}   )
      .then((res) => res.data.data);
  }
  
  deleteUser(id) {
        
    const urlDelete = `http://localhost:1486/api/admin/users?id=` + String(id);

    return axios.delete(urlDelete);
  }
  saveUser(user) {
        
    return axios.post("http://localhost:1486/api/admin/user", user, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updateUser(user) {
        
    return axios.put("http://localhost:8080/api/admin/order", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  uploadImageUser(event) {
        
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
