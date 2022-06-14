import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../service/ProductService';
import { DashboardService } from '../service/DashboardService';


const Dashboard = (props) => {
    const [sales, setSales] = useState(null);
    const [saling, setSaling] = useState([{id: 0, name:'', c:0}]);
    const [order, setOrder] = useState([{allorder: 0, neworder: 0}]);
    const [revenue, setRevenue] = useState([{inmonth: 0, lastmonth: 0}]);
    const [customer, setCustomer] = useState([{customer: 0, newRegister: 0}]);
    const [chart, setChart] = useState([{thang:3}]);
    const [arrngay, setArrngay] = useState(null);
    const [arrtong, setArrtong] = useState(null);
    const [cart, setCart]=useState([{id: 0, customerName:'', status:0}]);
    const [food, setFood] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null)

    useEffect(() => {
        
        const dashboardService = new DashboardService(); console.log("test");
        dashboardService.getSales().then((data) => {
            setSales(data);
            console.log(sales);
        })
        dashboardService.getSellings().then((data) => {
            setSaling(data);
        })
        dashboardService.getOrderTK().then((data) => {
            setOrder(data);
        })
        dashboardService.getRevenue().then((data) => {
            setRevenue(data);
        })
        dashboardService.getCustomer().then((data) => {
            setCustomer(data);
        })
        dashboardService.getChart().then((data) => {
            setChart(data);
        })
        dashboardService.getcart().then((data)=>{
            setCart(data);
        })
    }, [])
   

    
    const getDays = (year, month) => {
        return new Date(year, month, 0).getDate();
    };
    const formatDate=() =>{
        return Array.from(new Array(getDays(2022,chart[0].thang)), (x, i) => i + 1);
       // [...Array(1,getDays(2022,chart[0].thang)).keys()] 
    }
    const formatRevenue = ()=>{
        let arrtong = Array(formatDate().length).fill(0);
        
        for (var i in formatDate()){
            
            for (var item in chart){
                
                if (chart[item].ngay == i){
                    
                    arrtong[i-1] = chart[item].tong
                }
            }
        }
        
        return arrtong
        
        
    }
    console.log('arr')
    console.log('char'+chart)
    console.log('revenue'+formatRevenue())
    console.log('thang'+chart[0].thang)
   console.log(getDays(2022,chart[0].thang))
    const lineData = {
        
        labels: formatDate(),
      
        datasets: [
            {
                label: 'Revenue',
                // data: [3,2,3,23,23,232],
                data: formatRevenue(),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: .4
            },
            // {
            //     label: 'Second Dataset',
            //     data: [28, 48, 40, 19, 86, 27, 90],
            //     fill: false,
            //     backgroundColor: '#00bb7e',
            //     borderColor: '#00bb7e',
            //     tension: .4
            // }
        ]
    };

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    //useEffect(() => {
     //   const productService = new ProductService();
     //   productService.getProductsSmall().then(data => setProducts(data));
   // }, []);

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const renderListSaling = () => {
        console.log(saling)
        return saling.map((item, index)=> {
            return <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" key={index}>
            <div>
                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{item.name}</span>
                <div className="mt-1 text-600">Mã sản phẩm:{item.id}</div>
            </div>
            <div className="mt-2 md:mt-0 flex align-items-center">
                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{height: '8px'}}>
                    <div className="bg-orange-500 h-full" style={{width: '50%'}}/>
                </div>
                <span className="text-orange-500 ml-3 font-medium">Số lượng bán: {item.c}</span>
            </div>
        </li>
        })
    }
    const formatStatus = (value) => {
        if(value == 0) return String("Chờ xác nhận");
        else
        if(value == 1) return String(
        "Chờ phục vụ",
        );
        else if(value == 2) return String("Đang giao");
        else if(value == 3) return String("Đã giao")
        return String(
          "Đã huỷ",
          );
      };
    const renderNotification = ()=>{
        console.log(cart);
        return cart.map((item, index)=>{
           return  <li className="flex align-items-center py-2 border-bottom-1 surface-border" key={index}>
                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                    <i className="pi pi-dollar text-xl text-blue-500"/>
                </div>
                <span className="text-900 line-height-3">Mã đơn hàng: {item.id}
                
            <span className="text-2000"> Tên khách hàng: {item.customerName} </span><span className="text-blue-500">Trạng thái: {formatStatus(item.status)}</span></span>
            
            </li>
        })
    }
    const imageBodyTemplate = (rowData) => {
        return (
          <>
            <span className="p-column-title">Ảnh</span>
    
            <img
              src={`http://localhost:8080/Content/food/` + rowData.Alias + `_1.jpg`}
              alt={rowData.Alias}
              className="shadow-2"
              width="100"
            />
          </>
        );
      };

    return (
        <div className="grid">
           <div className="col-12 lg:col-6 xl:col-4">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Orders</span>
                        <div className="text-900 font-medium text-xl">{order[0].allorder}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                    </div>
                </div>
                <span className="text-green-500 font-medium">{order[0].neworder} new </span>
                <span className="text-500">since last visit</span>
            </div>
        </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Revenue in month</span>
                            <div className="text-900 font-medium text-xl">{revenue[0].inmonth} VND </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className="pi pi-map-marker text-orange-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{revenue[0].lastmonth} VND </span>
                    <span className="text-500">Last month</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Customers</span>
                            <div className="text-900 font-medium text-xl">{customer[0].customer}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className="pi pi-inbox text-cyan-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{customer[0].newRegister} </span>
                    <span className="text-500">newly registered</span>
                </div>
            </div>
            

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Sales</h5>
                    <DataTable value={sales} rows={5} paginator responsiveLayout="scroll">
                    <Column
              header="Hình ảnh"
              body={imageBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
                        <Column field="name" header="Name" sortable style={{width: '35%'}}/>
                        <Column field="originPrice" header="OriginPrice" sortable style={{width: '35%'}} />
                        <Column field="promotionPrice" header="PromotionPrice" style={{width:'15%'}} />
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Best Selling Products</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu1.current.toggle(event)}/>
                            <Menu ref={menu1} popup model={[{ label: 'Add New', icon: 'pi pi-fw pi-plus' }, { label: 'Remove', icon: 'pi pi-fw pi-minus' }]}/>
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {renderListSaling()}
                        
                        
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu2.current.toggle(event)}/>
                            <Menu ref={menu2} popup model={[{label: 'Add New', icon: 'pi pi-fw pi-plus'}, {label: 'Remove', icon: 'pi pi-fw pi-minus'}]}/>
                        </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">WAIT FOR ACCEPT</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none" >
                    {renderNotification()}
                    </ul>

                  
                </div>
               
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
