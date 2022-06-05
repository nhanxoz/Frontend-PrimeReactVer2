import axios from "axios";

export class DashboardService {
  getSales() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/sales", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getSellings() {
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/bestselling", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getOrderTK(){
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/allorder", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getRevenue(){
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/revenue", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getCustomer(){
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/customer", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getChart(){
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/chart", { withCredentials: true })
      .then((res) => res.data.data);
  }
  getcart(){
    axios.defaults.withCredentials = true;

    return axios
      .get(`http://localhost:1486/api/admin/acceptOrder`
      )
      .then((res) => res.data.data);
  }
  getfilter(id){
    axios.defaults.withCredentials = true;

    return axios
      .get(`http://localhost:1486/api/admin/filterOrder?stt=` + String(id)
      )
      .then((res) => res.data.data);
  }
  getfood(){
    axios.defaults.withCredentials = true;

    return axios
      .get("http://localhost:1486/api/admin/detailOrder", { withCredentials: true })
      .then((res) => res.data.data);
  }
}
