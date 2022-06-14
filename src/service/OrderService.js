import axios from "axios";
import { access_token } from "../contexts/constants";
export class OrderService {
  getOrder() {


    return axios
      .get("http://localhost:8080/api/Order", {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })
      .then((res) => res.data.data);
  }

  deleteOrder(id) {

    const urlDelete = `http://localhost:8080/api/admin/order?id=` + String(id);

    return axios.delete(urlDelete, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  }
  saveOrder(order) {

    return axios.post("http://localhost:8080/api/admin/editorder", order, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`
      },
      withCredentials: true,
    });
  }

  updateOrder(order) {

    return axios.put("http://localhost:8080/api/admin/order", order, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`
      },
    });
  }
  EditStatus(stt, ID) {

    const urlEdit = `http://localhost:8080/apiFood/orders?status=` + String(stt) + `&id=` + String(ID);
    console.log(urlEdit)
    return axios
    .put(urlEdit,urlEdit ,{
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

  }

  uploadImageFood(event) {
    let formData = new FormData();
    formData.append("file", event);
    return axios
      .post("http://localhost:8080/uploadFile", formData, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
      })
      .then((res) => {
        console.log(res.data.downloadUri);

        return res.data.downloadUri;
      });
  }
  getOrdersWithOrdersSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
