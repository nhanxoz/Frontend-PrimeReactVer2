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

const TimelineDemo = () => {
  let emptyOrder = {
    ID: null,
    CreatedByUserID: "",
    CustomerName: null,
    CustomerAddress: 0,
    FoodOptionID:0,
    Name: 0,
    Image: "",
    OriginPrice:0,
    PromotionPrice:0,
    Quantity:0,
    PaymentMethod:"",
    Status:""
  };
  //const [orders, setOrders] = useState([]);
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
    const orderService = new OrderService();
    orderService.getOrder().then((data) => {
      setOrders(data);
    });

    
  }, []);

  const formatCurrency = (value) => {
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

  const onChangeValue=(event) => {
    console.log(event.target.value);
    let _order = { ...order };
     _order["Status"]=event.target.value;
     console.log(_order["Status"])
    setOrder(_order);
    
  }

  const render=() =>{
    return (
      <div onChange={onChangeValue}>
        <div><label>Trạng thái</label> <h2>  </h2></div>
        <div>
        <input type="radio" value="1" name="Status" /> Đã phục vụ  
        <h2>  </h2>
        <input type="radio" value="0" name="Status" /> Chưa phục vụ
        </div>
      </div>
    );
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

    if (order.CustomerName.trim()) {
      let _orders = [...orders];
      let _order = { ...order };
     
        const index = findIndexById(order.ID);

        _orders[index] = _order;
        console.log(_order);
        const orderService = new OrderService();
        orderService.saveOrder(_order);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "order Updated",
          life: 3000,
        });
      

      setOrders(_orders);
      setOrderDialog(false);
      setOrder(emptyOrder);
      console.log(_orders);
    }
  };

  const editOrder = (order) => {
    setOrder({ ...order });
    setOrderDialog(true);
  };

  const confirmDeleteOrder = (order) => {
    setOrder(order);

    setDeleteOrderDialog(true);
  };

  const deleteOrder = () => {
    const orderService = new OrderService();
    orderService.deleteOrder(order.ID);
    let _orders = orders.filter((val) => val.id !== order.ID);
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
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].ID === id) {
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
      orderService.deleteOrder(selectedOrders[i].ID);
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
          
          <Button
            label="Xóa"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedOrders || !selectedOrders.length}
          />
        </div>
      </React.Fragment>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        /> */}
        <Button
          label="Xuất file Excel"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
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
        {rowData.ID}
      </>
    );
  };

  

  const NameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Tên món</span>
        {rowData.Name}
      </>
    );
  };

  const ImageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Hình ảnh</span>
        <img
          src={`http://localhost:1486/Content/food/` + rowData.Alias + `_1.jpg`}
          alt={rowData.Image}
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
        {rowData.OriginPrice}
      </>
    );
  };
  const PromotionPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Giá khuyến mãi</span>
        {rowData.PromotionPrice}
      </>
    );
  };
  const QuantityBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Số lượng</span>
        {rowData.Quantity}
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
      <h5 className="m-0">Danh sách đơn đặt món</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
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

          <DataTable
            ref={dt}
            value={orders}
            selection={selectedOrders}
            onSelectionChange={(e) => setSelectedOrders(e.value)}
            dataKey="ID"
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
              field="OrderID"
              header="Mã đặt đơn"
              sortable
              body={OrderIDBodyTemplate}
              headerStyle={{ width: "7%", minWidth: "7rem" }}
            ></Column>
          
            <Column
              field="CustomerName"
              header="Tên khách hàng"
              body={CustomerNameBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            
            
            <Column
              field="Name"
              header="Tên món"
              body={NameBodyTemplate}
              
             
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="Image"
              header="Hình ảnh"
              body={ImageBodyTemplate}
              
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="OriginPrice"
              header="Giá gốc"
              body={OriginPriceBodyTemplate}
              
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="PromotionPrice"
              header="Giá khuyến mãi"
              body={PromotionPriceBodyTemplate}
              
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="Quantity"
              header="Số lượng"
              body={QuantityBodyTemplate}
              
              headerStyle={{ width: "5%", minWidth: "5rem" }}
            ></Column>
              <Column
              field="PaymentMethod"
              header="Hình thức thanh toán"
              body={PaymentMethodBodyTemplate}
              
              headerStyle={{ width: "10%", minWidth: "5rem" }}
            ></Column>
            <Column
              field="Status"
              header="Trạng thái"
              body={StatusBodyTemplate}
              
              headerStyle={{ width: "10%", minWidth: "5rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

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
              <label htmlFor="description">Tên khách hàng</label>
              <InputText
                id="customername"
                value={order.CustomerName}
                onChange={(e) => onInputChange(e, "Name")}
              />
            </div>
            {order.Image && (
              <img
                src={
                  `http://localhost:1486/Content/food/` +
                  order.Alias +
                  `_1.jpg`
                }
                alt={order.Image}
                className="shadow-2"
                width="100"
              />
            )}
            <div className="field">
              <label htmlFor="name">Tên món ăn</label>
              <InputText
                id="name"
                value={order.Name}
                onChange={(e) => onInputChange(e, "Name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !order.Name,
                })}
              />
              {submitted && !order.Name && (
                <small className="p-invalid">Yêu cầu nhập tên món ăn</small>
              )}
            </div>
            
            <div className="field">{render()}</div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={order.PromotionPrice}
                  onValueChange={(e) =>
                    onInputNumberChange(e, "PromotionPrice")
                  }
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
              <div className="field col">
                <label htmlFor="OriginPrice">Giá gốc</label>
                <InputNumber
                  id="OriginPrice"
                  value={order.OriginPrice}
                  onValueChange={(e) => onInputNumberChange(e, "OriginPrice")}
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
            </div>
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
                  Bạn muốn xóa order này?<b>{order.Name}</b>?
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

export default React.memo(TimelineDemo, comparisonFn);
