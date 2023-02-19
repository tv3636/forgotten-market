import styled from "@emotion/styled";

const Arrows = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 88%;

  background-color: var(--darkGray);
  border-color: var(--midGray);
  border-style: solid;
  border-radius: 20px;
  padding: var(--sp-2);

  box-shadow: 0px 2px  var(--midGray);

  z-index: 5;

  @media only screen and (max-width: 600px) {
    width: 111%;
    height: 100%;
    top: auto;
    opacity: 50%;
    margin-left: 0px;
    margin-right: 0px;

    background-color: transparent;
    border-style: none;
    box-shadow: none;
  }

  transition: all 200ms;
`;

const ArrowImage = styled.img`
  height: 25px;
  width: 25px;
  cursor: pointer;
  padding: 7px;

  margin-left: var(--sp-4);
  margin-right: var(--sp-4);

  border-radius: 30px;
  border-width: 1px;
  border-color: var(--darkGray);

  @media only screen and (max-width: 600px) {
    height: 20px;
    width: 20px;
    padding: 5px;

    background-color: black;
  }

  transition: all 200ms;
`;

export default function Carousel({
  keyImage,
  setKeyImage,
  imageUrls,
}: {
  keyImage: number,
  setKeyImage: (image: number) => void;
  imageUrls: string[];
}) {
  return (
    <Arrows>
      <ArrowImage  
        src='/static/img/marketplace/arrow_left.png'
        onClick={()=> setKeyImage((keyImage - 1 + imageUrls.length) % imageUrls.length)}
      />
      <ArrowImage
        src='/static/img/marketplace/arrow_right.png' 
        onClick={()=> setKeyImage((keyImage + 1) % imageUrls.length)}
      />
    </Arrows>
  )
}
