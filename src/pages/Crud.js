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
import { ProductService } from "../service/ProductService";

const catarr = [{
  "name": "Bữa trưa",
  "id": 1,
  "alias": "buatrua",
  "status": 1
}, {
  "name": "Tráng miệng",
  "id": 2,
  "alias": "trangmieng",
  "status": 1
},{
  "name": "Đồ uống",
  "id": 3,
  "alias": "douong",
  "status": 1
},{
  "name": "Bữa sáng",
  "id": 4,
  "alias": "buasang",
  "status": 1
}]


const Crud = () => {
  let emptyFood = {
    id: null,
    name: "",
    alias: null,
    originPrice: 0,
    promotionPrice: 0,
    category: {name:null, id:1, alias:null, status:1},
    description: "",
  };
  const [curC, setC] = useState(1);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyFood);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [uri, setUri] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const productService = new ProductService();
    productService.getFoods().then((data) => {
      setProducts(data);
    });

    productService.getCategories().then((data) => {
      setCategories(data.map((i, k) => i.name));
    });
  }, []);

  function removeAccents(str) {
    console.log(str)
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const openNew = () => {
    setProduct(emptyFood);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);
        
        _products[index] = _product;
        const productService = new ProductService();
        productService.updateFood(_product);
        console.log(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = products.reduce((a, b) => Math.max(a, b.id), 0) + 1;
        _product.alias = removeAccents(_product.name)
        _product.Image = uri;
       
        _products.push(_product);
        const productService = new ProductService();
        productService.saveFood(_product);
        console.log(_product)
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyFood);
      console.log(_products);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);

    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    const productService = new ProductService();

    productService.deleteFood(product.id);
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyFood);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
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
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    console.log(selectedProducts);
    const productService = new ProductService();
    for (var i in selectedProducts) {
      productService.deleteFood(selectedProducts[i].id);
    }

    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);

    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };
    
    _product["category"] = catarr[e.value-1];
    console.log(_product);
    setC(e.value-1)
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const chooseOptions = { label: "Choose", icon: "pi pi-fw pi-plus" };
  const myUploader = (file) => {
    const productService = new ProductService();

    productService. uploadImageFood(file.files[0], removeAccents(product.name)).then((data) => setUri(data));
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
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
            label="Xóa món"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || !selectedProducts.length}
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
  const renderChildForCategoriesButton = () => {
    return categories.map((value, index) => (
      <div className="field-radiobutton col-6" key={index}>
        <RadioButton
          inputId={index}
          name={index}
          value={index + 1}
          onChange={onCategoryChange}
          checked={product.categoryID === index + 1}
        />
        <label htmlFor={index}>{value}</label>
      </div>
    ));
  };
  const renderCategoriesRadioButton = () => {
    return (
      <>
        <label className="mb-3">Category</label>
        <div className="formgrid grid">{renderChildForCategoriesButton()}</div>
      </>
    );
  };
  const IDBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.name}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Image</span>

        <img
          src={`http://localhost:8080/downloadFile/` + rowData.alias + `_1.jpg`}
          alt={rowData.alias}
          className="shadow-2"
          width="100"
        />
      </>
    );
  };

  const originPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Giá gốc</span>
        {formatCurrency(rowData.originPrice)}
      </>
    );
  };
  const promotionPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Giá khuyến mãi</span>
        {formatCurrency(rowData.promotionPrice)}
      </>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Categories</span>
        {/* {categories[rowData.categoryID - 1]} */}
        {rowData.category!=null?rowData.category["name"] : "Chưa phân loại"}
      </>
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Mô tả</span>
        {rowData.description}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span
          className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
        >
          {rowData.inventoryStatus}
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
          onClick={() => editProduct(rowData)}
        />
        
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Danh sách món ăn</h5>
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

  const productDialogFooter = (
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
        onClick={saveProduct}
      />
    </>
  );
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </>
  );
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
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
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị món ăn từ {first} đến {last} của {totalRecords} món"
            globalFilter={globalFilter}
            emptyMessage="No products found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="id"
              header="ID"
              sortable
              body={IDBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="name"
              header="Tên món"
              sortable
              body={nameBodyTemplate}
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
              body={originPriceBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="promotionPrice"
              header="Giá khuyến mãi"
              body={promotionPriceBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="category"
              header="Loại món"
              sortable
              body={categoryBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="description"
              header="Mô tả"
              body={descriptionBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>

            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header="Chi tiết món"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {product.Image && (
              <img
                src={
                  `http://localhost:1486/Content/food/` +
                  product.Alias +
                  `_1.jpg`
                }
                alt={product.Image}
                className="shadow-2"
                width="100"
              />
            )}
            <div className="field">
              <label htmlFor="name">Tên món ăn</label>
              <InputText
                id="name"
                value={product.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.name,
                })}
              />
              {submitted && !product.name && (
                <small className="p-invalid">Yêu cầu nhập tên món ăn</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Mô tả</label>
              <InputTextarea
                id="description"
                value={product.Description}
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
            <div className="field">{renderCategoriesRadioButton()}</div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={product.promotionPrice}
                  onValueChange={(e) =>
                    onInputNumberChange(e, "promotionPrice")
                  }
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
              <div className="field col">
                <label htmlFor="originPrice">Giá gốc</label>
                <InputNumber
                  id="originPrice"
                  value={product.originPrice}
                  onValueChange={(e) => onInputNumberChange(e, "originPrice")}
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Bạn muốn xóa món ăn này?<b>{product.Name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && <span>Bạn muốn xóa tất cả món ăn đã chọn?</span>}
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

export default React.memo(Crud, comparisonFn);
