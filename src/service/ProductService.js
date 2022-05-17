import axios from "axios";

export class ProductService {
  getFoods() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/food", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getCategories() {
    axios.defaults.withCredentials = true;
    return axios
      .get("http://localhost:1486/api/admin/categories", {
        withCredentials: true,
      })
      .then((res) => res.data.data);
  }
  deleteFood(id) {
    axios.defaults.withCredentials = true;
    const urlDelete = `http://localhost:1486/api/admin/food?id=` + String(id);

    return axios.delete(urlDelete);
  }
  saveFood(food) {
    axios.defaults.withCredentials = true;
    return axios.post("http://localhost:1486/api/admin/food", food, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updateFood(food) {
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:8080/apiFood/foods/", food, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  getProductsWithOrdersSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
