import axios from "axios";

export class FoodCategoryService {
  getFoodCategory() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/categoryfood", { withCredentials: true })
      .then((res) => res.data.data);
  }
  
  deleteFoodCategory(id) {
    axios.defaults.withCredentials = true;
    const urlDelete = `http://localhost:1486/api/admin/categoryfood?id=` + String(id);

    return axios.delete(urlDelete);
  }
  saveFoodCategory(categoryfood) {
    axios.defaults.withCredentials = true;
    return axios.post("http://localhost:1486/api/admin/categoryfood", categoryfood, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updateFoodCategory(categoryfood) {
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:1486/api/admin/categoryfood", categoryfood, {
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
  getFoodCategorysWithFoodCategorysSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
