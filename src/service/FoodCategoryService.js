import axios from "axios";
import { access_token } from "../contexts/constants";

export class FoodCategoryService {
  getFoodCategory() {
        

    return axios
      .get("http://localhost:8080/api/admin/categoryfood",   {  headers: {
        'Authorization': `Bearer ${access_token}`
      }} )
      .then((res) => res.data.data);
  }
  
  deleteFoodCategory(id) {
        
    const urlDelete = `http://localhost:8080/api/admin/categoryfood/` + String(id);

    return axios.delete(urlDelete,{  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }
  saveFoodCategory(categoryfood) {
        
    return axios.post("http://localhost:8080/api/admin/categoryfood", categoryfood,{  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }

  updateFoodCategory(categoryfood) {
        
    return axios.put("http://localhost:8080/api/admin/categoryfood", categoryfood, {  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }
  uploadImageFood(event) {
        
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
