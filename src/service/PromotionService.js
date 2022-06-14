import axios from "axios";
import { access_token } from "../contexts/constants";
export class PromotionService {
  getPromotion() {
        

    return axios
      .get("http://localhost:8080/api/admin/promotions",  {  headers: {
        'Authorization': `Bearer ${access_token}`
      }}  )
      .then((res) => res.data.data);
  }
  
  deletePromotion(id) {
        
    const urlDelete = `http://localhost:1486/api/admin/delete?id=` + String(id);

    return axios.delete(urlDelete);
  }
  savePromotion(promotion) {
        
    return axios.post("http://localhost:1486/api/admin/promotion", promotion, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  updatePromotion(promotion) {
        
    return axios.put("http://localhost:8080/api/admin/promotion", promotion, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  uploadImagePromotion(event) {
        
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
