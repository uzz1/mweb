import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

export const ProductCard = ({ product, providerInfo }) => {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{product.productName}</h5>
          <Row className='card-row'>
            <Col>
            <h1 className="card-text"><strong>R{product.productRate}</strong></h1>
            </Col>
            <Col>
            <div className="card-img">
          <img src={providerInfo.find(p => p.name === product.provider)?.url} alt={product.provider} />
          </div>
            </Col>
         <Col>
         <Button className='btn-grad'>Check Coverage</Button>
         </Col>
          </Row>

        </div>
      </div>
    );
  }
  