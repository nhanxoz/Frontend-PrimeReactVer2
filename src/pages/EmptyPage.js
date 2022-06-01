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
import { FoodCategoryService } from "../service/FoodCategoryService";

const EmptyPage = () => {
  let emptyFoodCategory = {
    ID: null,
    Name: "",
    Alias: null,
    CreatedDate: null,
    CreatedBy: null,
    UpdateDate: null,
    UpdateBy: null,
    Status:null
  };
  //const [orders, setFoodCategorys] = useState([]);
  const [orders, setFoodCategorys] = useState(null);
  const [orderDialog, setFoodCategoryDialog] = useState(false);
  const [deleteFoodCategoryDialog, setDeleteFoodCategoryDialog] = useState(false);
  const [deleteFoodCategorysDialog, setDeleteFoodCategorysDialog] = useState(false);
  const [order, setFoodCategory] = useState(emptyFoodCategory);
  const [selectedFoodCategorys, setSelectedFoodCategorys] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [uri, setUri] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const foodCategoryService = new FoodCategoryService();
    foodCategoryService.getFoodCategory().then((data) => {
      setFoodCategorys(data);
    });

    
  }, []);

  const formatCurrency = (value) => {
    if(value == 1) return String(
    "Còn món",
    );
    return String(
      "Hết món",
      );
  };

  const openNew = () => {
    setFoodCategory(emptyFoodCategory);
    setSubmitted(false);
    setFoodCategoryDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFoodCategoryDialog(false);
  };

  const hideDeleteFoodCategoryDialog = () => {
    setDeleteFoodCategoryDialog(false);
  };

  const hideDeleteFoodCategorysDialog = () => {
    setDeleteFoodCategorysDialog(false);
  };

  const saveFoodCategory = () => {
    setSubmitted(true);

    if (order.Name.trim()) {
      let _orders = [...orders];
      let _order = { ...order };
      if (order.FoodCategoryID) {
        const index = findIndexById(order.FoodCategoryID);

        _orders[index] = _order;
        const foodCategoryService = new FoodCategoryService();
        foodCategoryService.saveFoodCategory(_order);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "order Updated",
          life: 3000,
        });
      } else {
        _order.ID = 1;

        _order.Image = uri;
        _orders.push(_order);
        const foodCategoryService = new FoodCategoryService();
        foodCategoryService.saveFoodCategory(_order);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "order Created",
          life: 3000,
        });
      }

      setFoodCategorys(_orders);
      setFoodCategoryDialog(false);
      setFoodCategory(emptyFoodCategory);
      console.log(_orders);
    }
  };

  const editFoodCategory = (order) => {
    setFoodCategory({ ...order });
    setFoodCategoryDialog(true);
  };

  const confirmDeleteFoodCategory = (order) => {
    setFoodCategory(order);

    setDeleteFoodCategoryDialog(true);
  };

  const deleteFoodCategory = () => {
    const foodCategoryService = new FoodCategoryService();

    foodCategoryService.deleteFoodCategory(order.FoodCategoryID);
    let _orders = orders.filter((val) => val.id !== order.id);
    setFoodCategorys(_orders);
    setDeleteFoodCategoryDialog(false);
    setFoodCategory(emptyFoodCategory);

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
      if (orders[i].FoodCategoryID === id) {
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
    setDeleteFoodCategorysDialog(true);
  };

  const deleteSelectedFoodCategorys = () => {
    console.log(selectedFoodCategorys);
    const foodCategoryService = new FoodCategoryService();
    for (var i in selectedFoodCategorys) {
      foodCategoryService.deleteFood(selectedFoodCategorys[i].ID);
    }

    let _orders = orders.filter((val) => !selectedFoodCategorys.includes(val));
    setFoodCategorys(_orders);

    setDeleteFoodCategorysDialog(false);
    setSelectedFoodCategorys(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "FoodCategorys Deleted",
      life: 3000,
    });
  };

  

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _order = { ...order };
    _order[`${name}`] = val;

    setFoodCategory(_order);
  };

  const chooseOptions = { label: "Choose", icon: "pi pi-fw pi-plus" };
  const myUploader = (file) => {
    const foodCategoryService = new FoodCategoryService();

    foodCategoryService
      .uploadImageFoodCategory(file.files[0])
      .then((data) => setUri(data));
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _order = { ...order };
    _order[`${name}`] = val;

    setFoodCategory(_order);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Thêm mới"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
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
  
  
  const FoodCategoryIDBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Mã danh mục</span>
        {rowData.ID}
      </>
    );
  };

  const NameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Tên danh mục</span>
        {rowData.Name}
      </>
    );
  };

  const CreatedDateBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ngày tạo</span>
        {rowData.CreatedDate}
        
      </>
    );
  };

  const CreateByBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Người tạo</span>
        {rowData.CreatedBy}
      </>
    );
  };
  const UpdateDateBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ngày cập nhật</span>
        {rowData.UpdateDate}
      </>
    );};
    const UpdateByBodyTemplate = (rowData) => {
      return (
        <>
          <span className="p-column-title">Ngày cập nhật</span>
          {rowData.UpdateBy}
        </>
      );};
      const StatusBodyTemplate = (rowData) => {
        return (
          <>
            <span className="p-column-title">Ngày cập nhật</span>
            {formatCurrency(rowData.Status)}
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
  
  
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editFoodCategory(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteFoodCategory(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Danh mục món ăn</h5>
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

  const categoryDialogFooter = (
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
        onClick={saveFoodCategory}
      />
    </>
  );
  const deleteFoodCategoryDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFoodCategoryDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFoodCategory}
      />
    </>
  );
  const deleteFoodCategorysDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFoodCategorysDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedFoodCategorys}
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
            selection={selectedFoodCategorys}
            onSelectionChange={(e) => setSelectedFoodCategorys(e.value)}
            dataKey="FoodCategoryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị  {first} đến {last} của {totalRecords} danh mục món ăn"
            globalFilter={globalFilter}
            emptyMessage="No orders found."
            header={header}
            responsiveLayout="scroll"
          >
            
            <Column
              field="ID"
              header="Mã danh mục"
              sortable
              body={FoodCategoryIDBodyTemplate}
              headerStyle={{ width: "7%", minWidth: "7rem" }}
            ></Column>
          
            <Column
              field="Name"
              header="Tên danh mục"
              body={NameBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            
              <Column
              field="CreatedDate"
              header="Ngày tạo"
              body={CreatedDateBodyTemplate}
              
              headerStyle={{ width: "10%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="CreateBy"
              header="Người tạo"
              body={CreateByBodyTemplate}
              
              headerStyle={{ width: "7%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="UpdateDate"
              header="Ngày chỉnh sửa"
              body={UpdateDateBodyTemplate}
              
              headerStyle={{ width: "7%", minWidth: "10rem" }}
            ></Column>
              <Column
              field="UpdateBy"
              header="Người chỉnh sửa"
              body={UpdateByBodyTemplate}
              
              headerStyle={{ width: "7%", minWidth: "7rem" }}
            ></Column>
            <Column
              field="Status"
              header="Trạng thái"
              body={StatusBodyTemplate}
              
              headerStyle={{ width: "7%", minWidth: "7rem" }}
            ></Column>

            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={orderDialog}
            style={{ width: "450px" }}
            header="Thông tin danh mục"
            modal
            className="p-fluid"
            footer={categoryDialogFooter}
            onHide={hideDialog}
          >
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
              <label htmlFor="name">Tên danh mục</label>
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
                <small className="p-invalid">Yêu cầu nhập tên danh mục</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Mô tả</label>
              <InputTextarea
                id="description"
                value={order.Description}
                onChange={(e) => onInputChange(e, "Description")}
                required
                rows={3}
                cols={20}
              />
            </div>
            <Toolbar
              className="mb-4"
              right={
                <FileUpload
                  chooseOptions={chooseOptions}
                  customUpload
                  uploadHandler={myUploader}
                />
              }
            ></Toolbar>
            
            
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
            visible={deleteFoodCategoryDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteFoodCategoryDialogFooter}
            onHide={hideDeleteFoodCategoryDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {order && (
                <span>
                  Bạn muốn xóa món ăn này?<b>{order.Name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteFoodCategorysDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteFoodCategorysDialogFooter}
            onHide={hideDeleteFoodCategorysDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {order && <span>Bạn muốn xóa tất cả món ăn đã chọn khum?</span>}
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

export default React.memo(EmptyPage, comparisonFn);
