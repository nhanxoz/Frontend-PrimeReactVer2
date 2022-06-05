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
import { PromotionService } from "../service/PromotionService";
import { ProductService } from "../service/ProductService";

const Promotion = () => {
  let emptyPromotion = {
    ID: null,
    Name: "",
    Description: "",
    ActiveDay: "",
    EndDay:"",
    FoodID: null
  };
 
  const [promotions, setPromotions] = useState(null);
  const [promotionDialog, setPromotionDialog] = useState(false);
  const [deletePromotionDialog, setDeletePromotionDialog] = useState(false);
  const [deletePromotionsDialog, setDeletePromotionsDialog] = useState(false);
  const [promotion, setPromotion] = useState(emptyPromotion);
  const [selectedPromotions, setSelectedPromotions] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [uri, setUri] = useState(null);
  const [products, setProducts] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const promotionService = new PromotionService();
    promotionService.getPromotion().then((data) => {
     
      setPromotions(data);
      
    });

    
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  
  const openNew = () => {
    setPromotion(emptyPromotion);
    setSubmitted(false);
    setPromotionDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPromotionDialog(false);
  };

  const hideDeletePromotionDialog = () => {
    setDeletePromotionDialog(false);
  };

  const hideDeletePromotionsDialog = () => {
    setDeletePromotionsDialog(false);
  };

  const savePromotion = () => {
    setSubmitted(true);

    if (promotion.Name.trim()) {
      let _promotions = [...promotions];
      let _promotion = { ...promotion };
      if (promotion.ID) {
        const index = findIndexById(promotion.ID);

        _promotions[index] = _promotion;
        const promotionService = new PromotionService();
        promotionService.savePromotion(_promotion);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Promotion Updated",
          life: 3000,
        });
      } else {
        _promotion.ID = promotions.reduce((a, b) => Math.max(a, b.ID), 0) + 1;
        _promotions.push(_promotion);
        const promotionService = new PromotionService();
        promotionService.savePromotion(_promotion);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Promotion Created",
          life: 3000,
        });
      }

      setPromotions(_promotions);
      setPromotionDialog(false);
      setPromotion(emptyPromotion);
      console.log(_promotions);
    }
  };

  const editPromotion = (promotion) => {
    setPromotion({ ...promotion });
    setPromotionDialog(true);
  };

  const confirmDeletePromotion = (promotion) => {
    setPromotion(promotion);

    setDeletePromotionDialog(true);
  };

  const deletePromotion = () => {
    const promotionService = new PromotionService();

    promotionService.deletePromotion(promotion.ID);
    let _promotions = promotions.filter((val) => val.id !== promotion.id);
    setPromotions(_promotions);
    setDeletePromotionDialog(false);
    setPromotion(emptyPromotion);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Promotion Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < promotions.length; i++) {
      if (promotions[i].ID === id) {
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
    setDeletePromotionsDialog(true);
  };

  const deleteSelectedPromotions = () => {
    console.log(selectedPromotions);
    const promotionService = new PromotionService();
    for (var i in selectedPromotions) {
      promotionService.deletePromotion(selectedPromotions[i].ID);
    }

    let _promotions = promotions.filter((val) => !selectedPromotions.includes(val));
    setPromotions(_promotions);
    setDeletePromotionsDialog(false);
    setSelectedPromotions(emptyPromotion);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Promotions Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _promotion = { ...promotion };
    _promotion["CategoryID"] = e.value;
    setPromotion(_promotion);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _promotion = { ...promotion };
    _promotion[`${name}`] = val;

    setPromotion(_promotion);
  };

  const chooseOptions = { label: "Choose", icon: "pi pi-fw pi-plus" };
  const myUploader = (file) => {
    const promotionService = new PromotionService();

    promotionService
      .uploadImagePromotion(file.files[0])
      .then((data) => setUri(data));
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _promotion = { ...promotion };
    _promotion[`${name}`] = val;

    setPromotion(_promotion);
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
          <Button
            label="Xóa"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedPromotions || !selectedPromotions.length}
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
  

  // const renderCategoriesRadioButton = () => {
  //   return (
  //     <>
  //       <label className="mb-3">List Food Apply</label>
  //       <div className="formgrid grid">{ListProduct}</div>
  //     </>
  //   );
  // };
  const IDBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">ID</span>
        {rowData.ID}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.Name}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>

        <img
          src={`http://localhost:1486/Content/food/` + rowData.Alias + `.jpg`}
          alt={rowData.image}
          className="shadow-2"
          width="100"
        />
      </>
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Mô tả</span>
        {rowData.Description}
      </>
    );
  };
  const formatDate=(value) =>{
    return (Date(value*1000));
  }
  const activedayBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ngày bắt đầu</span>
          {formatDate(rowData.ActiveDay)}
      </>
    );
  };
  const enddayBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ngày kết thúc</span>
        <span>
          {Date(rowData.EndDay)}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editPromotion(rowData)}
        />
        {/* <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeletePromotion(rowData)}
        /> */}
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Danh sách Mã giảm giá</h5>
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

  const promotionDialogFooter = (
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
        onClick={savePromotion}
      />
    </>
  );
  const deletePromotionDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeletePromotionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deletePromotion}
      />
    </>
  );
  const deletePromotionsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeletePromotionsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedPromotions}
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
            value={promotions}
            selection={selectedPromotions}
            onSelectionChange={(e) => setSelectedPromotions(e.value)}
            dataKey="ID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị mã từ {first} đến {last} của {totalRecords} mã"
            globalFilter={globalFilter}
            emptyMessage="No promotions found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="ID"
              header="ID"
              sortable
              body={IDBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
           <Column
              field="Name"
              header="Tên mã"
              sortable
              body={nameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            
            <Column
              field="Description"
              header="Mô tả"
              body={descriptionBodyTemplate}
              
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            
            <Column
              field="ActiveDay"
              header="Ngày bắt đầu"
              body={activedayBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="EndDay"
              header="Ngày kết thúc"
              body={enddayBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={promotionDialog}
            style={{ width: "450px" }}
            header="Chi tiết món"
            modal
            className="p-fluid"
            footer={promotionDialogFooter}
            onHide={hideDialog}
          >
           
            <div className="field">
              <label htmlFor="name">Tên mã</label>
              <InputText
                id="name"
                value={promotion.Name}
                onChange={(e) => onInputChange(e, "Name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !promotion.Name,
                })}
              />
              {submitted && !promotion.Name && (
                <small className="p-invalid">Yêu cầu nhập tên mã</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Mô tả</label>
              <InputTextarea
                id="description"
                value={promotion.Description}
                onChange={(e) => onInputChange(e, "Description")}
                required
                rows={3}
                cols={20}
              />
            </div>
            
            
            {/* <div className="field">{renderCategoriesRadioButton()}</div> */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="activeday">Ngày bắt đầu</label>
                <InputNumber
                  id="activeday"
                  value={promotion.ActiveDay}
                  onValueChange={(e) =>
                    onInputNumberChange(e, "Activeday")
                  }
                 
                />
              </div>
              <div className="field col">
                <label htmlFor="endday">Ngày kết thúc</label>
                <InputNumber
                  id="endday"
                  value={promotion.EndDay}
                  //onValueChange={(e) => onInputNumberChange(e, "Endday")}
                  
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deletePromotionDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deletePromotionDialogFooter}
            onHide={hideDeletePromotionDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {promotion && (
                <span>
                  Bạn muốn xóa món ăn này?<b>{promotion.Name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deletePromotionsDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deletePromotionsDialogFooter}
            onHide={hideDeletePromotionsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {promotion && <span>Bạn muốn xóa tất cả mã đã chọn không?</span>}
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

export default React.memo(Promotion, comparisonFn);
