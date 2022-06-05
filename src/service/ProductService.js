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
    console.log(food)
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:1486/api/admin/editfood", food, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  uploadImageFood(event, filename) {
    axios.defaults.withCredentials = true;
    let formData = new FormData();
    formData.append("file", event);
    filename = filename + '_1.jpg';
    formData.append("filename", filename);
    return axios
      .post("http://localhost:1486/api/ImageAPI/UploadFiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);

        return res.data;
      });
  }
  getProductsWithOrdersSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
