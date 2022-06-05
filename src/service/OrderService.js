import axios from "axios";

export class OrderService {
  getOrder() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/Order", { withCredentials: true })
      .then((res) => res.data.data);
  }
  
  deleteOrder(id) {
    axios.defaults.withCredentials = true;
    const urlDelete = `http://localhost:1486/api/admin/order?id=` + String(id);

    return axios.delete(urlDelete);
  }
  saveOrder(order) {
    axios.defaults.withCredentials = true;
    return axios.post("http://localhost:1486/api/admin/editorder", order, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updateOrder(order) {
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:1486/api/admin/order", order, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  EditStatus(ID, stt) {
    axios.defaults.withCredentials = true;
    const urlEdit = `http://localhost:1486/api/admin/editstatus?ID=` + String(ID) +`&stt=` + String(stt);

    return axios.put(urlEdit);

  }

  uploadImageFood(event) {
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
  getOrdersWithOrdersSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
