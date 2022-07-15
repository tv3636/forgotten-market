import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Image from 'next/image';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: center;

  margin-left: var(--sp5);
  margin-right: var(--sp5);
  margin-top: var(--sp4);

  @media only screen and (max-width: 1250px) {
    margin-top: var(--sp1);
  }

  @media only screen and (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
    justify-content: center;
  }

  > * {
    margin-right: var(--sp0);
  }

  background: transparent;
`;

const TraitRow = styled.div`
  color: var(--lightGray);
  margin-bottom: var(--sp-4);
  width: 20ch;
  position: relative;

  z-index: 1;

  background-color: var(--frameGray);
  border-image: url("/static/img/trait_background.png");
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 15 20;

  box-shadow: 3px 4px 0 var(--mediumGray);

  padding-left: var(--sp-1);
  padding-right: var(--sp-1);

  transition: all 100ms;
`;

const TraitType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  
  font-size: var(--sp-1);
  color: var(--beige);
  
  margin-bottom: var(--sp-4);
`;

const TraitItem = styled.div`
  font-size: var(--sp1);
  font-family: Alagard;
  color: var(--white);
  text-shadow: 0px 2.5px var(--darkGray);

  margin-right: var(--sp-1);

  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :hover {
    color: white;
  }

  @media only screen and (max-width: 600px) {
    font-size: var(--sp0);
  }
  
  transition: all 100ms;
`;

const Close = styled.div`
  width: 10px;
  height: 10px;

  :hover {
    cursor: pointer;
  }
`;


export default function FilterHeader({}: {}) {
  const router = useRouter();

  function removeFilter(filter: string) {
    delete router.query[filter];
    router.push({query: router.query}, undefined, {shallow: true});
  }

  return (
    <Container>
      {
        Object.keys(router.query).map((trait: string, index: number) => {
          return (
            trait != 'activity' && trait != 'source' && trait != 'contractSlug' &&
            <TraitRow key={index}>
              <TraitType>
                {trait.toUpperCase()}
                <Close onClick={() => removeFilter(trait)} style={{alignSelf: 'flex-end'}}>
                  <Image src='/static/img/x.png' width='20px' height='20px'/>
                </Close>
              </TraitType>
              <TraitItem>
                {router.query[trait]}
              </TraitItem>
            </TraitRow>
          );
        })
      }
    </Container>
  )
}
