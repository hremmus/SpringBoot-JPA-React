import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import InputWithLabel from "lib/styleUtils";
import styled from "styled-components";

const CategoryList = ({
  categories,
  activeCategory,
  subcategoryName,
  setSubcategoryName,
  handleActive,
  handleAdd,
  handleDelete,
}) => {
  return (
    <List>
      {categories.map((category) => (
        <>
          <ListItemStyled depth={category.depth}>
            <ListItemText>{category.name}</ListItemText>
            <ListItemSecondaryAction>
              <Button onClick={() => handleActive(category.id)}>추가</Button>
              <Button onClick={() => handleDelete(category.id)}>삭제</Button>
            </ListItemSecondaryAction>
          </ListItemStyled>
          {activeCategory === category.id && (
            <ListItemStyled depth={category.depth + 1}>
              <InputWithLabel
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="카테고리 이름을 입력하세요."
              />
              <Button onClick={() => handleAdd(category.id, subcategoryName)}>
                생성
              </Button>
            </ListItemStyled>
          )}
        </>
      ))}
    </List>
  );
};

export default CategoryList;

const ListItemStyled = styled(ListItem)`
  && {
    padding-left: ${({ depth }) => depth * 2}vw;
  }
`;
