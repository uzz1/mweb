import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormControl, Button } from 'react-bootstrap';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { CheckSquareFill, CheckSquare } from 'react-bootstrap-icons';
import "./Products.css"
import { providerInfo } from '../data/ProviderInfo';
import { priceRanges } from '../data/PriceRanges';
import { ProductCard } from './ProductCard';
import { Carousel } from './Carousel';


const FibreProducts = () => {
const [providersState, setProvidersState] = useState([]);
const [selectedProviders, setSelectedProviders] = useState([]);
const [campaigns, setCampaigns] = useState([]);
const [selectedCampaign, setSelectedCampaign] = useState(null);
const [promoCodeProducts, setPromoCodeProducts] = useState([null]);
const [summarizedProducts, setSummarizedProducts] = useState([]);
const [selectedProducts, setSelectedProducts] = useState([]);
const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
const [numProductsToShow, setNumProductsToShow] = useState(10);
const [allSelectedProducts, setAllSelectedProducts] = useState([]);
const [remainingProducts, setRemainingProducts] = useState(allSelectedProducts);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [dropdownOpen2, setDropdownOpen2] = useState(false);

const toggle = () => setDropdownOpen(prevState => !prevState);
const toggle2 = () => setDropdownOpen2(prevState => !prevState);


const baseURL = "https://apigw.mweb.co.za/prod/baas/proxy";


useEffect(() => {
fetch('https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public')
.then(response => response.json())
//.then(data => console.log(data.campaigns))
.then(response => setCampaigns(response.campaigns))
.catch(error => console.log(error));
}, [campaigns]);

useEffect(() => {
if(selectedProviders){
    getSelectedProducts()
}  
},[selectedProviders]);


const getSummarizedProducts = async (promoCodes) => {
    const promcodeProductsURL = `${baseURL}/marketing/products/promos/${promoCodes.join(',')}?sellable_online=true`;
    const response = await fetch(promcodeProductsURL);
    const data = await response.json();
    const summarizedProductsVar = data.reduce((prods, pc) => [...prods, ...getProductsFromPromo(pc)], []);
    setProviders(summarizedProductsVar)
    setSummarizedProducts(summarizedProductsVar)
    return summarizedProductsVar;
  };

const setProviders = (summarizedProductsVar) => {
    const providers = ([...new Set(summarizedProductsVar.map(p => p.provider))]);
    setProvidersState(providers);
    console.log(providers)
}
  
const handleCampaignChange = async (event) => {
    setSelectedProviders([])
    const campaign = event.target.value;
    const selected = campaigns.find(c => c.code === campaign);
    setSelectedCampaign(selected);
    
    try {
      const summarizedProducts = await getSummarizedProducts(selected.promocodes);
      setPromoCodeProducts(summarizedProducts);
    } catch (error) {
      console.error(error);
    }
  };

const getSummarizedProduct = ({productCode, productName, productRate, subcategory}) => {
    var provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return {productCode, productName, productRate, provider}
  }
const getProductsFromPromo = (pc) => {
    const promoCode = pc.promoCode
    return pc.products.reduce((prods, p) => [...prods, getSummarizedProduct(p)], [])
}

const getSelectedProducts = () => {
    const selectedProviderSet = new Set(selectedProviders)
    let selectedProductsVar = summarizedProducts.filter(p => selectedProviderSet.has(p.provider))
    if (selectedProductsVar.length > 10) {
    setSelectedProducts(selectedProductsVar.slice(0, numProductsToShow));
    setRemainingProducts(selectedProductsVar.slice(numProductsToShow))
    } else {
        setSelectedProducts(selectedProductsVar);
        setRemainingProducts([])
    }
    setAllSelectedProducts(selectedProductsVar)
}

const handleProviderSelect = (item) => {
    if (selectedProviders.includes(item)) {
      setSelectedProviders(selectedProviders.filter((selected) => selected !== item));
    } else {
      setSelectedProviders([...selectedProviders, item]);
    }
    
  };


const handlePriceRangeChange = (rangeLabel) => {
  
  const updatedRanges = [...selectedPriceRanges];
  if (updatedRanges.includes(rangeLabel)) {
    updatedRanges.splice(updatedRanges.indexOf(rangeLabel), 1);
  } else {
    updatedRanges.push(rangeLabel);
  }
  setSelectedPriceRanges(updatedRanges);

  const selectedProviderSet = new Set(selectedProviders);
  const selectedProductsVar = summarizedProducts.filter(p => selectedProviderSet.has(p.provider));

  const filteredProducts = selectedProductsVar.filter((product) => {
    if (updatedRanges.length === 0) {
      setAllSelectedProducts(selectedProductsVar);
      return true;
    }
    for (const rangeLabel of updatedRanges) {
      const range = priceRanges.find((range) => range.label === rangeLabel);
      if (range && product.productRate >= range.min && product.productRate <= range.max) {
        return true;
      }
    }
    return false;
  });

  setSelectedProducts(filteredProducts.slice(0, 10));
  setAllSelectedProducts(filteredProducts);
};

  const loadMoreProducts = () => {
    const remainingProductsVar = allSelectedProducts.filter((p) => !selectedProducts.includes(p));
    if (remainingProductsVar.length >10) {
      const nextProducts = remainingProductsVar.slice(0, 10);
      setSelectedProducts((prevProducts) => [...prevProducts, ...nextProducts]);
      setRemainingProducts(remainingProductsVar)
    } else {
      setSelectedProducts((prevProducts) => [...prevProducts, ...remainingProductsVar]);
      setRemainingProducts([])
    }
    
  };  
  



return (
<Container className="products-container">
<h1><strong>Fibre Products</strong></h1>
<Row>
{campaigns.length > 0 && (
<>
<p>Select a campaign:</p>
<FormControl size="lg"  as="select" onChange={handleCampaignChange}>
<optgroup className='providers'>
<option value="">-- Select a campaign --</option>
{campaigns.map(campaign => (
<option key={campaign.code} value={campaign.code}>
{campaign.name}
</option>

))}
</optgroup>
</FormControl>
<hr />
</>
)}


<Row className="mb-4">
{providersState && selectedCampaign?
<>  
<Col>

<h3><strong>Fibre Providers</strong></h3>
      <h6>Select a Fibre infrastructure provider below to browse the products available</h6>
      <Carousel items={providersState} onSelect={handleProviderSelect} selectedItems={selectedProviders} providerInfo={providerInfo} />
      </Col>
      {selectedProviders.length > 0 ?
      <>
      <Col lg="4">
        <br></br>
        <br></br>
      <h4><strong>Selected Providers</strong></h4>
      <h6>(Click to remove provider)</h6>
      <Carousel items={selectedProviders} onSelect={handleProviderSelect} selectedItems={selectedProviders} providerInfo={providerInfo} />
      </Col>
        </>
: 
<>
<br></br>
<h6>Select a provider to browse products</h6>
</>
}
    </>
:null}


<div>
   

    {selectedProviders.length > 0 ? (
        <>
        <br></br>
        <br></br>
        <br></br>
        <h3><strong>Choose a Fibre Package</strong></h3>
         
          <Row className="filter-row">
          <div>
          Filter by:
          </div>
            <Col>
           
          <br></br>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
  <DropdownToggle caret>
  Price
  </DropdownToggle>
  <DropdownMenu>
    {priceRanges.map((range, index) => (
      <DropdownItem key={index} 
        value={[range.label]}
        className={selectedPriceRanges.includes(range.label) ? "selected" : ""}
        onClick={() => handlePriceRangeChange(range.label)}
      >
        <CheckSquareFill 
        className={selectedPriceRanges.includes(range.label) ? "selected-icon" : "unselected-icon"}/>
          <CheckSquare
        className={selectedPriceRanges.includes(range.label) ? "unselected-icon" : "selected-icon2"}/>
        {range.label}
      </DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
</Col>
<Col>
        
          <br></br>
      <Dropdown isOpen={dropdownOpen2} toggle={toggle2}>
  <DropdownToggle caret>
  Provider
  </DropdownToggle>
  <DropdownMenu>
    {providersState.map((provider, index) => (
      <DropdownItem key={index} 
        value={[provider]}
        className={selectedProviders.includes(provider) ? "selected" : ""}
        onClick={() => handleProviderSelect(provider)}
      >
        <CheckSquareFill 
        className={selectedProviders.includes(provider) ? "selected-icon" : "unselected-icon"}/>
          <CheckSquare
        className={selectedProviders.includes(provider) ? "unselected-icon" : "selected-icon2"}/>
        {provider}
      </DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
</Col>
{selectedPriceRanges.length > 0 ?
<Col>

<div>
          Selected Price Filters:
          </div>
<br></br>
        {priceRanges.map((range, index) => (
          <div className='selected-div'>
            <span className={selectedPriceRanges.includes(range.label) ? "selected-filter" : "none"}>
              {range.label}
            </span>
          </div>
        ))}
        </Col>
:null}

      </Row>
    <Row>
      <br></br>
      <br></br>
        {selectedProducts.map((product, index) => (
          <>
          <Col lg="6" md="6" sm="6" xs="12">
          <ProductCard product={product} providerInfo={providerInfo}/>
          
          </Col>
                </>
        ))}
      {remainingProducts.length > 0 && (
        <div className='button-div'>
      <Button className='load-more' onClick={loadMoreProducts}>Load More Products</Button>

        </div>
    )}
    </Row>
        </>
    ) : (
      selectedCampaign && selectedProviders.length > 0?
      <p>No products to show</p>
      :null
    )}
  </div>

</Row>
</Row>
</Container>
);
};


export default FibreProducts;
