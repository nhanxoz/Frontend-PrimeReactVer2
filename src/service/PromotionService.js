import axios from "axios";

export class PromotionService {
  getPromotion() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/promotion", { withCredentials: true })
      .then((res) => res.data.data);
  }
  
  deletePromotion(id) {
    axios.defaults.withCredentials = true;
    const urlDelete = `http://localhost:1486/api/admin/delete?id=` + String(id);

    return axios.delete(urlDelete);
  }
  savePromotion(promotion) {
    axios.defaults.withCredentials = true;
    return axios.post("http://localhost:1486/api/admin/promotion", promotion, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updatePromotion(promotion) {
    axios.defaults.withCredentials = true;
    return axios.put("http://localhost:8080/api/admin/promotion", promotion, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  uploadImagePromotion(event) {
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
  getPromotionsWithPromotionsSmall() {
    return axios
      .get("assets/demo/data/products-orders-small.json")
      .then((res) => res.data.data);
  }
}
