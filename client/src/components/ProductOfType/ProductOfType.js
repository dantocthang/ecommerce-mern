import Slider from 'react-slick'
import ProductItem from '../ProductItem'

import classNames from 'classnames/bind';
import styles from './ProductOfType.module.scss';
const cl = classNames.bind(styles);

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "red" }}
            onClick={onClick}
        />
    );
}


function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        />
    );
}

function ProductOfType({ data, title }) {
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    return (
        <div className={cl('wrapper')}>
            <div className="grid wide">
                <div className={cl('title')}>{title}</div>
                <div className="row">
                    <Slider className={cl('img-list')} {...settings}>
                        {data && data.map(product => (
                            <div key={product._id} className={cl('item-wrapper')}>
                                <ProductItem data={product}></ProductItem>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default ProductOfType