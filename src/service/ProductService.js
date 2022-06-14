import axios from "axios";
import { access_token } from "../contexts/constants";
export class ProductService {
  getFoods() {
    return axios
      .get("http://localhost:8080/apiFood/foods",{  headers: {
        'Authorization': `Bearer ${access_token}`
      }} )
      .then((res) => res.data.data);
  }
  getCategories() {
        
    return axios
      .get("http://localhost:8080/api/admin/categoryfood",{  headers: {
        'Authorization': `Bearer ${access_token}`
      }})
      .then((res) => res.data.data);
  }
  deleteFood(id) {
        
    const urlDelete = `http://localhost:8080/apiFood/foods/` + String(id);

    return axios.delete(urlDelete,{  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }
  saveFood(food) {
        
    return axios.post("http://localhost:8080/apiFood/foods", food,{  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }

  updateFood(food) {
    console.log(food)
        
    return axios.put("http://localhost:8080/apiFood/foods", food, {  headers: {
      'Authorization': `Bearer ${access_token}`
    }});
  }
  uploadImageFood(event, filename) {
        
    let formData = new FormData();
    formData.append("file", event);
    filename = filename + '_1.jpg';
    formData.append("filename", filename);
    return axios
      .post("http://localhost:8080/uploadFile", formData, {
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
