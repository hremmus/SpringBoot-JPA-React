import { grey } from "@material-ui/core/colors";
import styled from "styled-components";
import GradeChip from "./GradeChip";

const LocationCard = ({ local, grade }) => {
  return (
    <CardContent>
      <GradeChip grade={grade} />
      <div className="text">{local}</div>
    </CardContent>
  );
};

export default LocationCard;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 1.25rem;
  height: 55px;
  background-color: ${grey[50]};

  .text {
    margin-left: 0.75rem;
    font-size: 17px;
    font-family: "NIXGONM-Vb";
    font-weight: 500;
  }
`;
