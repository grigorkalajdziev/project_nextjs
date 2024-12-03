import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

const ImageCta = ({ image, tags, title, url }) => {
  return (
    <div className="image-cta text-center space-mb--r100">
      <Container>
        <Row>
          <Col lg={8} className="ml-auto mr-auto">
            {/*=======  image  =======*/}
            <div className="image-cta__image space-mb--35">
              <img
                src={process.env.PUBLIC_URL + image}
                className="img-fluid"
                alt=""
              />
            </div>
            {/*=======  tags  =======*/}
            <div className="image-cta__tags space-mb--35">
              <ul>
                {tags &&
                  tags.map((tag, i) => {
                    return (
                      <li key={i}>
                        <Link href={url} as={process.env.PUBLIC_URL + url}>
                          <a>#{tag}</a>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/*=======  content  =======*/}
            <div className="image-cta__content">
              <h2
                className="space-mb--30"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <Link href={url} as={process.env.PUBLIC_URL + url}>
                <a className="lezada-button lezada-button--medium">shop now</a>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImageCta;
