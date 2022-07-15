import styled from "@emotion/styled";
import { getValue } from "./marketplaceHelpers";
import TraitLink from "./TraitLink";

const AffinityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  
  width: 100%;
  margin-bottom: var(--sp-2);
`;

const BasicRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 9%;
`;

const Title = styled.div`
  font-family: Alagard;
  font-size: var(--sp1);
`;

const Tag = styled.div`
  display: flex;
  flex-direction: row;

  margin-left: var(--sp-3);
  
  font-family: Terminal;
  font-size: var(--sp-1);
  color: var(--beige);
`;

const ProgressBar = styled.div`
  border-image-source: url(/static/img/progress.png);
  border-image-slice: 35 50;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;

  width: 80%;
  height: var(--sp1);

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Progress = styled.div`
  background-color: var(--lightGray);

  margin-left: 4px;
  margin-right: 4px;
  height: 48%;

  @media only screen and (max-width: 600px) {
    margin-left: 2px;
    margin-right: 2px;
  }
`;

export default function Affinity({
  attributes,
  fullAttributes
}: {
  attributes: {key: string, value: string}[];
  fullAttributes: any;
}) {
  let affinityType = getValue(attributes, "Affinity");
  let traitsInAffinity = getValue(attributes, '# Traits in Affinity');
  let numTraits = getValue(attributes, '# Traits');

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
    <AffinityWrapper>
      <TraitLink trait={'Affinity'} value={affinityType}>
        <Row>
          <Title>
            {affinityType}
          </Title>
          <Tag>
            {
              traits['Affinity'] &&
              `(${((traits['Affinity'][affinityType] / maxCount) * 100)
                .toPrecision(traits['Affinity'][affinityType] == maxCount ? 3 : 2)}%)`
            }
          </Tag>
        </Row>
      </TraitLink>
      <Row style={{justifyContent: 'space-around'}}>
        <ProgressBar>
          <Progress style={{width: `${100 * (Number(traitsInAffinity) / Number(numTraits))}%`}} />
        </ProgressBar>
        <BasicRow>
          <TraitLink trait={'# Traits in Affinity'} value={traitsInAffinity}>
            <Title>
              {traitsInAffinity}
            </Title>
          </TraitLink>
          {`/`}
          <TraitLink trait={'# Traits'} value={numTraits}>
            <Title>
              {numTraits}
            </Title>
          </TraitLink>
        </BasicRow>
      </Row>
    </AffinityWrapper>
  )
}