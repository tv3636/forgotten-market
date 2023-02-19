import styled from "@emotion/styled";
import { getValue } from "./marketplaceHelpers";
import TraitLink from "./TraitLink";

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;

  > *:not(:last-child) {
    margin-bottom: var(--sp-2);
  }

  width: 100%;
`;

const BioRow = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: baseline;
`;

const Trait = styled.div`
  font-family: Terminal;
  font-size: var(--sp-1);
  color: var(--beige);
`;

const Value = styled.div`
  font-family: Alagard;
  font-size: var(--sp0);
  color: var(--white);

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    max-width: 12ch;
  }
`;

const Tuple = styled.div`
  display: flex;
  flex-direction: row;

  .tag {
    margin-left: var(--sp-3);
  }

  align-items: baseline;
`;

function BioItem({
  trait,
  value,
  traits,
  count,
}: {
  trait: string;
  value: string;
  traits: any;
  count: number;
}) {
  return (
    <TraitLink trait={trait} value={value}>
      <BioRow>
        <Trait>{trait.toUpperCase()}</Trait>
        <Tuple>
          <Value>{value}</Value>
          <Trait className="tag">
            {
              traits[trait] &&
              `(${((traits[trait][value] / count) * 100)
                .toPrecision(traits[trait][value] == count ? 3 : 2)}%)`
            }
          </Trait>
        </Tuple>
      </BioRow>
    </TraitLink>
  )
}

export default function Bio({
  attributes,
  fullAttributes,
  collection,
}:{
  attributes: {key: string, value: string}[];
  fullAttributes: any;
  collection: string;
}) {
  var traitCounts: any = {};
  var traits: any = {};
  var maxCount = 0;

  for (var trait of fullAttributes) {
    var totalCount = 0;
    traits[trait.key] = {};
    
    for (var value of trait.values) {
      totalCount += value.count;
      traits[trait.key][value.value] = value.count;
    }

    traitCounts[trait.key] = totalCount;
    maxCount = Math.max(maxCount, totalCount);
  }

  return (
    <BioContainer>
      { collection == 'Warriors' ? 
        <>
         <BioItem
            trait={'Name'}
            value={getValue(attributes, 'Name')}
            traits={traits}
            count={maxCount}
          />
          <BioItem
            trait={'Title'}
            value={getValue(attributes, 'Title')}
            traits={traits}
            count={maxCount}
          />
        </>
        :
        <>
          <BioItem
            trait={'Title'}
            value={getValue(attributes, 'Title')}
            traits={traits}
            count={maxCount}
          />
          <BioItem
            trait={'Name'}
            value={getValue(attributes, 'Name')}
            traits={traits}
            count={maxCount}
          />
        </>
      }
      <BioItem
        trait={collection == 'Warriors' ? 'Affiliation' : 'Origin'}
        value={getValue(attributes, collection == 'Warriors' ? 'Affiliation' : 'Origin')}
        traits={traits}
        count={maxCount}
      />
    </BioContainer>
  )
}
