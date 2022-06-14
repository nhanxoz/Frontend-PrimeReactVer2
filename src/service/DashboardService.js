import axios from "axios";
import { access_token } from "../contexts/constants";
export class DashboardService {
  getSales() {
    

    return axios
      .get("http://localhost:8080/apiSale/sale", {  headers: {
        'Authorization': `Bearer ${access_token}`
      }})
      .then((res) => res.data);
  }
  getSellings() {
    

    return axios
      .get("http://localhost:8080/apiSelling/selling"  , {  headers: {
        'Authorization': `Bearer ${access_token}`
      }}  )
      .then((res) => res.data);
  }
  getOrderTK(){
        

    return axios
      .get("http://localhost:8080/apiOrder/allorder" , {  headers: {
        'Authorization': `Bearer ${access_token}`
      }}  )
      .then((res) => res.data);
  }
  getRevenue(){

    return axios
      .get("http://localhost:8080/apiAdmin/revenue",{  headers: {
        'Authorization': `Bearer ${access_token}`
      }}   )
      .then((res) => res.data);
  }
  getCustomer(){
        

    return axios
      .get("http://localhost:8080/api/admin/customer"    ,{  headers: {
        'Authorization': `Bearer ${access_token}`
      }} )
      .then((res) => res.data);
  }
  getChart(){
        

    return axios
      .get("http://localhost:8080/apiAdmin/chart" ,{  headers: {
        'Authorization': `Bearer ${access_token}`
      }}    )
      .then((res) => res.data);
  }
  getcart(){
    return axios
      .get(`http://localhost:8080/apiFood/orders`,{  headers: {
        'Authorization': `Bearer ${access_token}`
      }} 
      )
      .then((res) => res.data);
      
  }
  getfilter(id){
        

    return axios
      .get(`http://localhost:8080/apiFood/filterOrders?status=` + String(id),{  headers: {
        'Authorization': `Bearer ${access_token}`
      }}
      )
      .then((res) => res.data);
  }
  getfood(){
        

    return axios
      .get("http://localhost:8080/apiFood/detailOrder" ,{  headers: {
        'Authorization': `Bearer ${access_token}`
      }}  )
      .then((res) => res.data);
  }
}
