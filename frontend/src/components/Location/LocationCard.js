import oc from "open-color";
import styled from "styled-components";
import GradeChip from "./GradeChip";

const LocationCard = ({ local, grade }) => {
  return (
    <CardContent>
      <div className="align">
        <GradeChip grade={grade} />
        <div className="text">{local}</div>
      </div>
    </CardContent>
  );
};

export default LocationCard;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 1.25rem;
  height: 55px;
  background-color: ${oc.gray[1]};

  .align {
    display: flex;
    align-items: center;
  }

  .text {
    margin-left: 0.75rem;
    font-size: 17px;
    font-family: "NIXGONM-Vb";
    font-weight: 500;
  }
`;
