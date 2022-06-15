import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { OrderService } from "../service/OrderService";
import { DashboardService } from "../service/DashboardService";

const AcceptOrder = () => {
    let emptyOrder = {
        id: 0, customerName: '', status: 0,
        order_food: [{ quantity: 0, food: { name: '', image: '', originPrice: 0, promotionPrice: 0, alias: '' } }]

    };
    //const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([{ id: 0, customerName: '', status: 0, order_food: [{ quantity: 0, food: { name: '', image: '', originPrice: 0, promotionPrice: 0, alias: '' } }] }]);

    const [orders, setOrders] = useState(null);
    const [orderDialog, setOrderDialog] = useState(false);
    const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
    const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
    const [order, setOrder] = useState(emptyOrder);
    const [selectedOrders, setSelectedOrders] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [uri, setUri] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const dashboardService = new DashboardService;
        dashboardService.getcart().then((data) => {
            setCart(data);
            console.log(data);
        });

    }, []);
    console.log(cart);


    const formatCurrency = (value) => {
        if (value == 0) return String("Chờ duyệt");
        else
            if (value == 1) return String(
                "Chờ phục vụ",
            );
            else if (value == 2) return String("Đang giao");
            else if (value == 3) return String("Đã giao")
        return String(
            "Đã huỷ",
        );
    };

    const onChangeValue = (event) => {
        console.log(event.target.value);
        let _order = { ...order };
        _order["status"] = event.target.value;
        console.log(_order["status"])
        setOrder(_order);

    }
    const formatStatus = (value) => {
        if (value == 0) return String("Chờ xác nhận");
        else
            if (value == 1) return String(
                "Đang giao",
            );
            else if (value == 2) return String("Đã giao");

        return String(
            "Đã huỷ",
        );
    };
    const render = () => {
        return (
            <div onChange={onChangeValue}>
                <div><label>Trạng thái:</label> <h2>  </h2></div>
                <div>
                    <input type="radio" value="0" name="Status" /> Chờ xác nhận
                    <h2>  </h2>
                    <input type="radio" value="1" name="Status" /> Đang giao
                    <h2>  </h2>
                    <input type="radio" value="2" name="Status" /> Đã giao
                    <h2>  </h2>
                    <input type="radio" value="3" name="Status" /> Đã huỷ

                </div>
            </div>
        );
    }
    const renderFoodOrder = (item) => {
        //console.log(f);

        return <div>
            <DataTable
                ref={dt}
                value={item.order_food}
                selection={selectedOrders}
                onSelectionChange={(e) => setSelectedOrders(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị đơn đặt món {first} đến {last} của {totalRecords} đơn"
                globalFilter={globalFilter}
                emptyMessage="No orders found."
                header={header}
                responsiveLayout="scroll"
            >

                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                ></Column>
                <Column
                    field="name"
                    header="Tên món"
                    sortable
                    body={NameBodyTemplate}
                    headerStyle={{ width: "14%", minWidth: "10rem" }}
                ></Column>
                <Column
                    header="Hình ảnh"
                    body={imageBodyTemplate}
                    headerStyle={{ width: "14%", minWidth: "10rem" }}
                ></Column>
                <Column
                    field="originPrice"
                    header="Giá gốc"
                    body={OriginPriceBodyTemplate}

                    headerStyle={{ width: "14%", minWidth: "10rem" }}
                ></Column>
                <Column
                    field="promotionPrice"
                    header="Giá khuyến mãi"
                    body={PromotionPriceBodyTemplate}

                    headerStyle={{ width: "14%", minWidth: "10rem" }}
                ></Column>
                <Column
                    field="quantity"
                    header="Số lượng"
                    body={QuantityBodyTemplate}

                    headerStyle={{ width: "5%", minWidth: "5rem" }}
                ></Column>


            </DataTable>
        </div>
    }

    const renderBody = () => {
        console.log(cart);
        return cart.map((item, index) => {
            return <li className="" key={index}>

                <span className="text-900 line-height-3">
                    Mã đơn hàng: {item.id}
                    <span className="text-2000"> Tên khách hàng: {item.customerName} </span>
                    <span className="text-blue-500">Trạng thái: {formatStatus(item.status)}       </span>
                    <i class="pi pi-pencil" onClick={() => editOrder(item)}>

                    </i>
                </span>
                {renderFoodOrder(item)}
            </li>
        })
    }
    const hideDialog = () => {
        setSubmitted(false);
        setOrderDialog(false);
    };

    const hideDeleteOrderDialog = () => {
        setDeleteOrderDialog(false);
    };

    const hideDeleteOrdersDialog = () => {
        setDeleteOrdersDialog(false);
    };

    const saveOrder = () => {
        setSubmitted(true);


        //   let _orders = [...orders];
        let _order = { ...order };
        const index = findIndexById(_order.id);
        let _cart = { ...cart };
        _cart[index].status = _order.status;

        console.log(_order);
        const orderService = new OrderService();
        orderService.EditStatus(_order.status, _order.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "order Updated",
            life: 3000,
        });


        setOrder(_order);
        setOrderDialog(false);
        setOrder(emptyOrder);
        //setCart(_cart);

    }


    const editOrder = (item) => {
        console.log(item);
        setOrder(item);
        console.log(order);
        setOrderDialog(true);
    };

    const confirmDeleteOrder = (order) => {
        setOrder(order);

        setDeleteOrderDialog(true);
    };

    const deleteOrder = () => {
        const orderService = new OrderService();
        orderService.deleteOrder(order.id);
        let _orders = orders.filter((val) => val.id !== order.id);
        setOrders(_orders);
        setDeleteOrderDialog(false);
        setOrder(emptyOrder);

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "order Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteOrdersDialog(true);
    };

    const deleteSelectedOrders = () => {
        console.log(selectedOrders);
        const orderService = new OrderService();
        for (var i in selectedOrders) {
            orderService.deleteOrder(selectedOrders[i].id);
        }

        let _orders = orders.filter((val) => !selectedOrders.includes(val));
        setOrders(_orders);

        setDeleteOrdersDialog(false);
        setSelectedOrders(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Orders Deleted",
            life: 3000,
        });
    };



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _order = { ...order };
        _order[`${name}`] = val;

        setOrder(_order);
    };

    const chooseOptions = { label: "Choose", icon: "pi pi-fw pi-plus" };
    const myUploader = (file) => {
        const orderService = new OrderService();

        orderService
            .uploadImageOrder(file.files[0])
            .then((data) => setUri(data));
    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _order = { ...order };
        _order[`${name}`] = val;

        setOrder(_order);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">

                    {/* <Button
                        label="Xóa"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedOrders || !selectedOrders.length}
                    /> */}
                </div>
            </React.Fragment>
        );
    };
    const [stt, setStt] = useState();
    const FilterByStt = (event) => {
        const stt = event.target.value;
        setStt(stt);
        console.log(stt);
        const dashboardService = new DashboardService();
        dashboardService.getfilter(stt).then((data) => {
            setCart(data)
        });

    }
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div>
                    <select id="stt" value={stt}
                        onChange={FilterByStt}>
                        <option value="0">Chờ xác nhận</option>
                        <option value="1">Đang giao</option>
                        <option value="2">Đã giao</option>
                        <option value="3">Đã huỷ</option>
                    </select>

                </div>
                {/* <Button
                    label="Xuất file Excel"
                    icon="pi pi-upload"
                    className="p-button-help"
                    onClick={exportCSV}
                /> */}
            </React.Fragment>
        );
    };


    const OrderIDBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mã đặt đơn</span>
                {rowData.ID}
            </>
        );
    };

    const CreatedByUserIDBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mã khách hàng</span>
                {rowData.CreatedByUserID}
            </>
        );
    };

    const CustomerNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên khách hàng</span>
                {rowData.CustomerName}

            </>
        );
    };

    const CustomerAddressBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Địa chỉ</span>
                {rowData.CustomerAddress}
            </>
        );
    };
    const IDBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mã món</span>
                {rowData.id}
            </>
        );
    };



    const NameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên món</span>
                {rowData.food.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>

                <img
                    src={`http://localhost:8080/downloadFile/` + rowData.food.image}
                    alt={rowData.food.image}
                    className="shadow-2"
                    width="100"
                />
            </>
        );
    };

    const OriginPriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giá gốc</span>
                {rowData.food.originPrice}
            </>
        );
    };
    const PromotionPriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giá khuyến mãi</span>
                {rowData.food.promotionPrice}
            </>
        );
    };
    const QuantityBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Số lượng</span>
                {rowData.quantity}
            </>
        );
    };
    const PaymentMethodBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Hình thức thanh toán</span>
                {rowData.PaymentMethod}
            </>
        );
    };
    const StatusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Trạng thái</span>
                {formatCurrency(rowData.Status)}
            </>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editOrder(rowData)}
                />

            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Danh sách món ăn</h5>
            {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(formatStatus(e.target.value.Status))}
                    placeholder="Tìm kiếm..."
                />
            </span> */}
        </div>
    );

    const orderDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveOrder}
            />
        </>
    );
    const deleteOrderDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteOrderDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteOrder}
            />
        </>
    );
    const deleteOrdersDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteOrdersDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteSelectedOrders}
            />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-4"
                        left={leftToolbarTemplate}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    {renderBody()}

                    <Dialog
                        visible={orderDialog}
                        style={{ width: "450px" }}
                        header="Chi tiết order"
                        modal
                        className="p-fluid"
                        footer={orderDialogFooter}
                        onHide={hideDialog}

                    >
                        <div className="field">
                            <label htmlFor="ID">Mã đơn hàng: {order.id} </label>

                        </div>

                        <div className="field">
                            <label htmlFor="FullName">Tên Khách hàng:   </label>
                            {order.customerName}
                        </div>

                        <div className="field">{render()}</div>


                    </Dialog>

                    <Dialog
                        visible={deleteOrderDialog}
                        style={{ width: "450px" }}
                        header="Xác nhận"
                        modal
                        footer={deleteOrderDialogFooter}
                        onHide={hideDeleteOrderDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            />
                            {order && (
                                <span>
                                    Bạn muốn xóa order này?<b>{order.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={deleteOrdersDialog}
                        style={{ width: "450px" }}
                        header="Xác nhận"
                        modal
                        footer={deleteOrdersDialogFooter}
                        onHide={hideDeleteOrdersDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            />
                            {order && <span>Bạn muốn xóa tất cả Order?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(AcceptOrder, comparisonFn);
